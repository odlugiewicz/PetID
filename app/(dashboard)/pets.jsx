import { StyleSheet, TouchableWithoutFeedback, FlatList, Pressable, Image, View } from 'react-native'
import { useRouter } from 'expo-router'
import { usePets } from '../../hooks/usePets'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons';

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import { useEffect } from 'react';


const Pets = () => {
  const router = useRouter()
  const { pets, getPetImageUrl } = usePets()

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
          contentContainerStyle={{ alignSelf: 'flex-start' , alignItems: 'center'}}
          numColumns= {2}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          width={'80%'}
          renderItem={({ item }) => {
            const imageUrl = item.imageId ? getPetImageUrl(item.imageId) : null;
            console.log("Pet Image URL:", imageUrl);
            return (
              <Pressable onPress={() => router.push(`/pets/${item.$id}`)} style={{ flex: 1, margin:1, minWidth: '50%' }}>
                <ThemedCard style={styles.card}>
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                    />
                  ) : (
                    <View style={[styles.petImagePlaceholder, { backgroundColor: Colors.light.uiBackground }]}>
                      <Ionicons name="camera-outline" size={40} color={Colors.light.text} />
                    </View>
                  )}
                  <ThemedText style={styles.title}>{item.name}</ThemedText>
                  <ThemedText>{item.species}</ThemedText>
                </ThemedCard>
              </Pressable>
            )
          }}
        />


        <ThemedButton
          style={styles.button}
          onPress={() => router.push('/addPet')}
        >
          <ThemedText>
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
    marginTop: 40,

  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    alignItems: 'center',
    marginVertical: 10,
    padding: 15,
    borderRadius: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  petImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  petImagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})