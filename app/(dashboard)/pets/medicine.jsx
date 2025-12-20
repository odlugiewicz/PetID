import { StyleSheet, TouchableWithoutFeedback, FlatList, Pressable, View, useColorScheme, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Colors } from '../../../constants/Colors'

import Spacer from "../../../components/Spacer"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import ThemedButton from '../../../components/ThemedButton'
import ThemedCard from '../../../components/ThemedCard'
import ThemedLoader from '../../../components/ThemedLoader'
import { usePets } from '../../../hooks/usePets'
import { useMedicines } from '../../../hooks/useMedicines'

const Medicine = () => {
  const router = useRouter()
  const colorSheme = useColorScheme()
  const theme = Colors[colorSheme] ?? Colors.light

  const [pet, setPet] = useState(null)
  const [records, setRecords] = useState([])
  const { petId } = useLocalSearchParams()
  const { fetchPetById } = usePets()
  const { fetchMedicinesByPet } = useMedicines()

  useEffect(() => {
    async function loadPet() {
      if (petId) {
        const petData = await fetchPetById(petId)
        setPet(petData)
      }
    }
    loadPet()
    return () => setPet(null)
  }, [petId, fetchPetById])

  useEffect(() => {
    async function loadRecords() {
      if (petId) {
        const docs = await fetchMedicinesByPet(petId)
        setRecords(docs)
      }
    }
    loadRecords()
  }, [petId, fetchMedicinesByPet])

  const { current, past } = useMemo(() => {
    const now = new Date().toISOString()
    const curr = []
    const pst = []
    records.forEach(r => {
      if (r.endDate && r.endDate >= now) curr.push(r); else pst.push(r)
    })
    return { current: curr, past: pst }
  }, [records])

  if (!pet) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  const renderItem = ({ item }) => (
    <ThemedCard style={styles.card}>
      <ThemedText style={styles.title}>{item.medicineName}</ThemedText>
      <Spacer height={6} />
      <ThemedText>Dosage: {item.dosage}</ThemedText>
      {item.manufacturer ? (<ThemedText>Manufacturer: {item.manufacturer}</ThemedText>) : null}
      <ThemedText>Ends: {new Date(item.endDate).toLocaleDateString('en-GB')}</ThemedText>
    </ThemedCard>
  )

  return (
    <TouchableWithoutFeedback>
      <ThemedView style={styles.container} safe={true}>
        <ThemedText title={true} style={styles.heading}>
          {pet.name} Medicines
        </ThemedText>

        <Spacer />
        <ThemedText style={styles.section}>Current</ThemedText>
        <FlatList
          style={styles.list}
          data={current}
          keyExtractor={(item) => item.$id}
          renderItem={renderItem}
          ListEmptyComponent={<ThemedText style={styles.empty}>No current medicines.</ThemedText>}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        <Spacer height={10} />
        <ThemedText style={styles.section}>Past</ThemedText>
        <FlatList
          style={styles.list}
          data={past}
          keyExtractor={(item) => item.$id}
          renderItem={renderItem}
          ListEmptyComponent={<ThemedText style={styles.empty}>No past medicines.</ThemedText>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <ThemedButton onPress={() => router.replace({ pathname: `/pets/[id]`, params: { id: pet.$id } })} style={styles.cancel}>
          <Text style={{ color: theme.button }}>
            Back
          </Text>
        </ThemedButton>
      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Medicine

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {
    fontWeight: 'bold', fontSize: 30, textAlign: 'center', marginTop: 40, color: Colors.primary,
  },
  section: { marginTop: 10, marginLeft: 20, fontSize: 18, color: Colors.primary },
  list: { marginTop: 10 },
  card: {
    width: '90%', marginHorizontal: '5%', marginVertical: 8, padding: 12, borderLeftColor: Colors.primary, borderLeftWidth: 4, borderRadius: 15,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  empty: { textAlign: 'center', opacity: 0.6, marginVertical: 8 },
  cancel: {
    marginTop: 20, backgroundColor: Colors.warning, width: '50%', alignSelf: 'center', alignItems: 'center',
  }
})
