export interface Crypto {
    encrypt(data: string): Promise<string>;
    verify(encryptData: string, data: string): Promise<boolean>;
}
