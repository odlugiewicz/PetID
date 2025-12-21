import { StyleSheet, View, useColorScheme, FlatList, Modal, Pressable, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Calendar } from 'react-native-calendars'
import { Ionicons } from '@expo/vector-icons'
import { ID, Permission, Role, Query } from 'react-native-appwrite'
import { databases } from '../../lib/appwrite'
import { useUser } from '../../hooks/useUser'
import { Colors } from '../../constants/Colors'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'
import DateTimePickerModal from "react-native-modal-datetime-picker"

const DATABASE_ID = "69051e15000f0c86fdb1"
const EVENTS_TABLE_ID = "events"

const CalendarUser = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const router = useRouter()
    const { user } = useUser()

    const [selectedDate, setSelectedDate] = useState('')
    const [events, setEvents] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [eventTitle, setEventTitle] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [eventTime, setEventTime] = useState(null)
    const [eventTimeString, setEventTimeString] = useState('')
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            fetchEvents()
        }
    }, [user])

    const fetchEvents = async () => {
        if (!user) return

        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                EVENTS_TABLE_ID,
                [Query.equal('userId', user.$id)]
            )

            const groupedEvents = response.documents.reduce((acc, event) => {
                const eventDate = new Date(event.eventDate)
                const year = eventDate.getFullYear()
                const month = String(eventDate.getMonth() + 1).padStart(2, '0')
                const day = String(eventDate.getDate()).padStart(2, '0')
                const dateKey = `${year}-${month}-${day}`
                
                if (!acc[dateKey]) {
                    acc[dateKey] = []
                }
                acc[dateKey].push({
                    id: event.$id,
                    title: event.title,
                    description: event.description || '',
                    time: event.eventTime || 'All day'
                })
                return acc
            }, {})

            setEvents(groupedEvents)
        } catch (error) {
            console.error('Failed to fetch events:', error)
        }
    }

    const showTimePicker = () => {
        setTimePickerVisibility(true)
    }

    const hideTimePicker = () => {
        setTimePickerVisibility(false)
    }

    const handleTimeConfirm = (time) => {
        const formattedTime = time.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        })
        setEventTimeString(formattedTime)
        setEventTime(time)
        hideTimePicker()
    }

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString)
    }

    const handleAddEvent = async () => {
        if (!eventTitle.trim()) {
            Alert.alert('Error', 'Please enter an event title')
            return
        }

        if (!user) {
            Alert.alert('Error', 'You must be logged in to add events')
            return
        }

        setLoading(true)

        try {
            const [year, month, day] = selectedDate.split('-')
            const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
            
            const newEventDoc = await databases.createDocument(
                DATABASE_ID,
                EVENTS_TABLE_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    title: eventTitle.trim(),
                    description: eventDescription.trim() || null,
                    eventDate: eventDate.toISOString(),
                    eventTime: eventTimeString || null,
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            )

            const newEvent = {
                id: newEventDoc.$id,
                title: eventTitle,
                description: eventDescription,
                time: eventTimeString || 'All day'
            }

            setEvents(prev => ({
                ...prev,
                [selectedDate]: [...(prev[selectedDate] || []), newEvent]
            }))

            setEventTitle('')
            setEventDescription('')
            setEventTime(null)
            setEventTimeString('')
            setModalVisible(false)


            Alert.alert('Success', 'Event added successfully')
        } catch (error) {
            console.error('Failed to add event:', error)
            Alert.alert('Error', 'Failed to add event. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteEvent = (eventId) => {
        Alert.alert(
            'Delete Event',
            'Are you sure you want to delete this event?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await databases.deleteDocument(
                                DATABASE_ID,
                                EVENTS_TABLE_ID,
                                eventId
                            )

                            setEvents(prev => ({
                                ...prev,
                                [selectedDate]: prev[selectedDate].filter(e => e.id !== eventId)
                            }))

                            Alert.alert('Success', 'Event deleted successfully')
                        } catch (error) {
                            console.error('Failed to delete event:', error)
                            Alert.alert('Error', 'Failed to delete event. Please try again.')
                        }
                    }
                }
            ]
        )
    }

    const markedDates = {
        ...Object.keys(events).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: Colors.primary }
            return acc
        }, {}),
        [selectedDate]: {
            selected: true,
            selectedColor: Colors.primary,
            marked: events[selectedDate]?.length > 0
        }
    }

    const renderEvent = ({ item }) => (
        <ThemedCard style={styles.eventCard}>
            <View style={styles.eventHeader}>
                <View style={{ flex: 1 }}>
                    <ThemedText style={styles.eventTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.eventTime}>{item.time}</ThemedText>
                    {item.description ? (
                        <ThemedText style={styles.eventDescription}>{item.description}</ThemedText>
                    ) : null}
                </View>
                <Pressable onPress={() => handleDeleteEvent(item.id)}>
                    <Ionicons name="trash-outline" size={24} color={Colors.warning} />
                </Pressable>
            </View>
        </ThemedCard>
    )

    return (
        <ThemedView safe={true} style={styles.container}>
            <ThemedText title={true} style={styles.heading}>
                Calendar
            </ThemedText>

            <Spacer />

            <Calendar
                theme={{
                    calendarBackground: theme.background,
                    textSectionTitleColor: theme.text,
                    selectedDayBackgroundColor: Colors.primary,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: Colors.primary,
                    dayTextColor: theme.text,
                    textDisabledColor: theme.text + '40',
                    monthTextColor: theme.text,
                    arrowColor: Colors.primary,
                }}
                onDayPress={handleDayPress}
                markedDates={markedDates}
            />

            <Spacer />

            {selectedDate && (
                <>
                    <View style={styles.selectedDateHeader}>
                        <ThemedText style={styles.selectedDateText}>
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </ThemedText>
                        <ThemedButton
                            onPress={() => setModalVisible(true)}
                            style={{ borderRadius: 25, padding: 10 }}
                        >
                            <Ionicons name="add" size={20} color={theme.button} />
                        </ThemedButton>
                    </View>

                    <FlatList
                        data={events[selectedDate] || []}
                        renderItem={renderEvent}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={
                            <ThemedText style={styles.noEvents}>
                                No events for this date
                            </ThemedText>
                        }
                        contentContainerStyle={styles.eventsList}
                    />
                </>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                                <ThemedText style={styles.modalTitle}>Add Event</ThemedText>

                                <Spacer />

                                <ThemedText style={styles.label}>Title *</ThemedText>
                                <ThemedTextInput
                                    style={styles.input}
                                    placeholder="Event title"
                                    value={eventTitle}
                                    onChangeText={setEventTitle}
                                />

                                <Spacer />

                                <ThemedText style={styles.label}>Time</ThemedText>
                                <ThemedButton
                                    style={[styles.timePicker, { backgroundColor: theme.uiBackground }]}
                                    onPress={showTimePicker}
                                >
                                    <View style={styles.row}>
                                        <ThemedText style={{ color: theme.text }}>
                                            {eventTimeString || "Select Time"}
                                        </ThemedText>
                                        <Ionicons name="time-outline" size={20} color={theme.text} />
                                    </View>
                                </ThemedButton>

                                <DateTimePickerModal
                                    isVisible={isTimePickerVisible}
                                    mode="time"
                                    onConfirm={handleTimeConfirm}
                                    onCancel={hideTimePicker}
                                    pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                                    textColor={theme.text}
                                />

                                <Spacer />

                                <ThemedText style={styles.label}>Description</ThemedText>
                                <ThemedTextInput
                                    style={styles.textArea}
                                    placeholder="Event description"
                                    value={eventDescription}
                                    onChangeText={setEventDescription}
                                    multiline
                                    numberOfLines={4}
                                    blurOnSubmit={false}
                                    textAlignVertical="top"
                                />

                                <Spacer />

                                <View style={styles.modalButtons}>
                                    <ThemedButton
                                        onPress={() => setModalVisible(false)}
                                        style={[styles.modalButton, { backgroundColor: Colors.warning }]}
                                        disabled={loading}
                                    >
                                        <ThemedText style={{ color: '#fff' }}>Cancel</ThemedText>
                                    </ThemedButton>
                                    <ThemedButton
                                        onPress={handleAddEvent}
                                        style={[styles.modalButton, { backgroundColor: Colors.primary }]}
                                        disabled={loading}
                                    >
                                        <ThemedText style={{ color: '#fff' }}>
                                            {loading ? 'Saving...' : 'Add Event'}
                                        </ThemedText>
                                    </ThemedButton>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ThemedView>
    )
}

export default CalendarUser

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 20,
        color: Colors.primary,
    },
    selectedDateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    selectedDateText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary,
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventsList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    eventCard: {
        marginVertical: 8,
        padding: 15,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventTime: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 4,
    },
    eventDescription: {
        fontSize: 14,
        marginTop: 8,
    },
    noEvents: {
        textAlign: 'center',
        opacity: 0.6,
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.primary,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        padding: 15,
        borderRadius: 8,
    },
    timePicker: {
        padding: 15,
        borderRadius: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textArea: {
        padding: 15,
        borderRadius: 8,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    modalButton: {
        width: '45%',
        alignItems: 'center',
    },
})