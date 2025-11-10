import { StyleSheet, TouchableWithoutFeedback, FlatList, Pressable, View, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { usePets } from '../../hooks/usePets'
import { Colors } from '../../constants/Colors'
import { getPetImagePreview } from '../../lib/appwrite'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import ThemedLoader from '../../components/ThemedLoader'

const Pets = () => {
  const router = useRouter()
  const { pets, loading } = usePets()

  const renderPetCard = ({ item: pet }) => {
    const imageUrl = getPetImagePreview(pet.imageId, 60, 60);
        
    return (
      <Pressable onPress={() => router.push(`/pets/${pet.$id}`)}>
        <ThemedCard style={styles.card}>
          <View style={styles.cardContent}>
            {imageUrl ? (
              <Image 
                source={{ uri: imageUrl }} 
                style={styles.petImage} 
              />
            ) : (
              <View style={[styles.petImage, styles.placeholder]}>
                <ThemedText style={styles.placeholderText}>No Photo</ThemedText>
              </View>
            )}

            <View style={styles.textContainer}>
              <ThemedText style={styles.title}>{pet.name}</ThemedText>
              <ThemedText style={styles.smallText}>{pet.species}</ThemedText>
              <ThemedText style={styles.smallText}>{pet.breed}</ThemedText>
            </View>
          </View>
        </ThemedCard>
      </Pressable>
    )
  }
  
  if (loading) {
    return <ThemedLoader />
  }

  return (
    <TouchableWithoutFeedback>
    <ThemedView style={styles.container} safe={true}>

      <ThemedText title={true} style={styles.heading}>
        Your Pets
      </ThemedText>

      <Spacer />

      <FlatList 
        data={pets}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        renderItem={renderPetCard}
      />


      <ThemedButton 
        style={styles.button}
        onPress={() => router.push('/addPet')}
      >
        <ThemedText style={styles.buttonText}>
          Add Pet
        </ThemedText>
      </ThemedButton>

    </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Pets

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40
  },
  button: {
    width: '40%',
    alignItems: 'center'
  },
  list: {
    marginTop: 20,
    width: '100%'
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  petImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
  },
  placeholder: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 10,
    color: Colors.dark.text
  },
  textContainer: {
      flex: 1,
      alignItems: 'center',

  },
  smallText: {
    fontSize: 14,
    color: '#666'
  },

})