declare module "expo-file-system" {
  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;

  export enum EncodingType {
    UTF8 = "utf8",
    Base64 = "base64",
  }

  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: { encoding?: EncodingType }
  ): Promise<void>;

  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: EncodingType }
  ): Promise<string>;
}