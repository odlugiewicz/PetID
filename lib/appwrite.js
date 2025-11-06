import { Client, Account, Avatars, Databases} from 'react-native-appwrite';

export const client= new Client()
    .setEndpoint('http://cloud.appwrite.io/v1')
    .setProject('68f95463000912ce3941')
    .setPlatform('dev.petid');

export const account = new Account(client);
export const avatars = new Avatars (client);
export const databases = new Databases (client);