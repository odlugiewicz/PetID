import { Client, Account, Avatars, Databases, Storage} from 'react-native-appwrite';

export const client= new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68f95463000912ce3941')
    .setPlatform('dev.petid');

export const account = new Account(client);
export const avatars = new Avatars (client);
export const databases = new Databases (client);
export const storage = new Storage (client);

export const PET_BUCKET_ID = "69111f64001a3b3c4563";

export function getPetImagePreview(fileId, width = 100, height = 100) {
    if (!fileId) {
        return null;
    }

    const endpoint = client.config.endpoint;
    const projectId = client.config.project;
    
    return `${endpoint}/storage/buckets/${PET_BUCKET_ID}/files/${fileId}/preview?project=${projectId}&width=${width}&height=${height}&quality=80&mode=crop`;
}