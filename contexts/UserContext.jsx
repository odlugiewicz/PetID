import { createContext, useState, useEffect } from "react";
import { account, databases } from "../lib/appwrite";
import { ID, Query } from "react-native-appwrite";

const DATABASE_ID = "69051e15000f0c86fdb1";
const VETS_TABLE_ID = "vets";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const response = await account.get();
      
      // Check if user is a vet
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

  async function register(
    email,
    password,
    name,
    phone,
    isVet,
    licenseNumber
  ) {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);

      // Store vet data if registering as vet
      if (isVet) {
        const userId = (await account.get()).$id;
        await databases.createDocument(DATABASE_ID, VETS_TABLE_ID, ID.unique(), {
          userId: userId,
          name: name,
          phone: phone,
          licenseNumber: licenseNumber,
          email: email,
        });

        // Update user object with vet role
        setUser((prev) => ({
          ...prev,
          role: "vet",
        }));
      } else {
        setUser((prev) => ({
          ...prev,
          role: "user",
        }));
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      const response = await account.get();
      
      // Check if user is a vet
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

  return (
    <UserContext.Provider value={{ user, login, register, logout, authChecked }}>
      {children}
    </UserContext.Provider>
  );
}