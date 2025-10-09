import * as FileSystem from 'expo-file-system';
import CryptoJS from 'crypto-js';

// 👇 Type assertion fixes missing documentDirectory in type definitions
const FS = FileSystem as typeof FileSystem & {
  documentDirectory: string | null;
  cacheDirectory: string | null;
};

const documentDirectory = FS.documentDirectory ?? FS.cacheDirectory ?? '';

const encryptionKey = 'shhhhhhhhh';

export async function encryptMediaToFile(uri: string): Promise<string> {
  const base64 = await FS.readAsStringAsync(uri, { encoding: 'base64' });

  const iv = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.enc.Utf8.parse(encryptionKey);

  const encrypted = CryptoJS.AES.encrypt(base64, key, { iv });
  const combined = iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.toString();

  const encryptedUri = `${documentDirectory}encrypted_media.enc`;
  await FS.writeAsStringAsync(encryptedUri, combined, { encoding: 'utf8' });

  return encryptedUri;
}
