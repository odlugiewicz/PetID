import { createContext, useState, useEffect } from "react";
import { account, databases, users } from "../lib/appwrite";
import { ID, Query, Permission, Role } from "react-native-appwrite";
import { is } from "date-fns/locale";

const DATABASE_ID = "69051e15000f0c86fdb1";
const VETS_TABLE_ID = "vets";
const PET_OWNERS_TABLE_ID = "pet_owners";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);

  async function fetchUserData() {
    if (!user || user.role !== 'user') return;

    try {
      const response = await databases.listDocuments(DATABASE_ID, PET_OWNERS_TABLE_ID, [
        Query.equal("userId", user.$id)
      ]);

      if (response.documents.length > 0) {
        setUserData(response.documents[0]);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const response = await account.get();

      const vets = await databases.listDocuments(DATABASE_ID, VETS_TABLE_ID, [
        Query.equal("userId", response.$id)
      ]);

      if (vets.documents.length > 0) {
        setUser({ ...response, role: "vet" });
      } else {
        setUser({ ...response, role: "user" });
      }

    } catch (error) {
      throw Error(error.message);
    }
  }

  async function register(email, password, name, phone, lastName, address, licenseNumber, isVet) {
    try {
      await account.create(ID.unique(), email, password, name, phone);
      await login(email, password);

      const userId = (await account.get()).$id;

      if (isVet) {
        await databases.createDocument(
          DATABASE_ID,
          VETS_TABLE_ID,
          ID.unique(),
          { firstName: name, lastName: lastName, phoneNumber: phone, address: address, email: email, licenseNumber: licenseNumber, userId: userId },
          [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId)),
          ]
        )
      } else {
        await databases.createDocument(
          DATABASE_ID,
          PET_OWNERS_TABLE_ID,
          ID.unique(),
          { firstName: name, lastName: lastName, phoneNumber: phone, address: address, email: email, userId: userId },
          [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId)),
          ]
        )
      }
    } catch (error) {
      console.error("Failed to register:", error);
    }
  }


  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      const response = await account.get();

      const vets = await databases.listDocuments(DATABASE_ID, VETS_TABLE_ID, [
        Query.equal("userId", response.$id)
      ]);

      if (vets.documents.length > 0) {
        setUser({ ...response, role: "vet" });
      } else {
        setUser({ ...response, role: "user" });
      }
    } catch (error) {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  useEffect(() => {
    if (user && user.role === 'user') { 
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, userData, login, register, logout, fetchUserData, authChecked }}>
      {children}
    </UserContext.Provider>
  );
}