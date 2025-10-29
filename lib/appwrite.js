import { Client, Account, Avatars} from 'react-native-appwrite';

export const client= new Client()
    .setProject('68f95463000912ce3941')
    .setPlatform('dev.petid');

export const account = new Account(client);
export const avatars = new Avatars (client);