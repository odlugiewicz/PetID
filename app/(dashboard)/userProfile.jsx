import { StyleSheet, Text } from 'react-native'
import { useUser } from '../../hooks/useUser'
import { Colors } from '../../constants/Colors'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedScroll from "../../components/ThemedScroll"
import ThemedCard from "../../components/ThemedCard"

const UserProfile = () => {
  const { logout, userData } = useUser()

  if (!userData) {
    return (
      <ThemedView style={styles.container} safe={true}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedScroll style={styles.container}>
      <ThemedCard style={styles.content} safe={true}>

        <ThemedText title={true} style={styles.heading}>
          Profile
        </ThemedText>

        <Spacer height={25} />

        <ThemedText style={styles.label}>First Name:</ThemedText>
        <ThemedText style={styles.info}>{userData.firstName}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>Last Name:</ThemedText>
        <ThemedText style={styles.info}>{userData.lastName}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>Phone Number:</ThemedText>
        <ThemedText style={styles.info}>{userData.phoneNumber}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>Email:</ThemedText>
        <ThemedText style={styles.info}>{userData.email}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>Address:</ThemedText>
        <ThemedText style={styles.info}>{userData.address}</ThemedText>


      </ThemedCard>

      <Spacer height={10} />

      <ThemedButton onPress={logout} style={styles.logout}>
        <Text style={{ color: 'white' }}>Logout</Text>
      </ThemedButton>

    </ThemedScroll>
  )
}

export default UserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  heading: {
      fontWeight: "bold",
      fontSize: 25,
      textAlign: "center",
      color: Colors.primary
    },
    label: {
      fontSize: 20,
      color: Colors.primary
    },
    info: {
      fontSize: 20,
      fontWeight: "bold",
    },
    button: {
      marginTop: 20,
      width: '40%',
      alignSelf: "center",
      alignItems: "center",
    },
    logout: {
      marginTop: 20,
      backgroundColor: Colors.warning,
      width: '40%',
      alignSelf: "center",
      alignItems: "center",
    },
})