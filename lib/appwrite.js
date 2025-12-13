import { Client, Account, Avatars, Databases, Storage, Functions} from 'react-native-appwrite';

export const client= new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68f95463000912ce3941')
    .setPlatform('dev.petid');

export const account = new Account(client);
export const avatars = new Avatars (client);
export const databases = new Databases (client);
export const storage = new Storage (client);
export const functions = new Functions(client);