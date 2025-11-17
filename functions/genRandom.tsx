import * as Crypto from 'expo-crypto';

export async function generateSecureString(length = 16, options = { numbers: true, letters: true, symbols: true }) {
  let charset = '';
  if (options.letters) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (options.numbers) charset += '0123456789';
  if (options.symbols) charset += '!@#$%^&*()-_=+[]{};:,.<>?';

  const randomBytes = await Crypto.getRandomBytesAsync(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[randomBytes[i] % charset.length];
  }
  return result;
}
