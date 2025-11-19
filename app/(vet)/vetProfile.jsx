import { StyleSheet, Text, ScrollView } from 'react-native'
import { useVet } from '../../contexts/VetContext'
import { useUser } from '../../hooks/useUser'
import { Colors } from '../../constants/Colors'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedScroll from '../../components/ThemedScroll'
import ThemedCard from '../../components/ThemedCard'

const VetProfile = () => {
  const { logout } = useUser()
  const { vetData } = useVet()

  if (!vetData) {
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
          Vet Profile
        </ThemedText>

        <Spacer height={25} />

        <ThemedText style={styles.label}>First Name:</ThemedText>
        <ThemedText style={styles.info}>{vetData.firstName}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>Last Name:</ThemedText>
        <ThemedText style={styles.info}>{vetData.lastName}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>Phone Number:</ThemedText>
        <ThemedText style={styles.info}>{vetData.phoneNumber}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>Email:</ThemedText>
        <ThemedText style={styles.info}>{vetData.email}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>Address:</ThemedText>
        <ThemedText style={styles.info}>{vetData.address}</ThemedText>

        <Spacer height={20} />

        <ThemedText style={styles.label}>License Number:</ThemedText>
        <ThemedText style={styles.info}>{vetData.licenseNumber}</ThemedText>


      </ThemedCard>

      
        <Spacer height={10} />

      <ThemedButton style={styles.button}>
        <Text style={{ color: 'white' }}>Edit Profile</Text>
      </ThemedButton>

      <ThemedButton onPress={logout} style={styles.logout}>
        <Text style={{ color: 'white' }}>Logout</Text>
      </ThemedButton>

    </ThemedScroll>
  )
}

export default VetProfile

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