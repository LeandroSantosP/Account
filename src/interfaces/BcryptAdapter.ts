import { Crypto } from "./Crypto";
import Bcrypt from "bcrypt";

export class BcryptAdepter implements Crypto {
    connection: typeof Bcrypt;
    constructor() {
        this.connection = Bcrypt;
    }
    async encrypt(data: string): Promise<string> {
        return this.connection.hash(data, 10);
    }
    async verify(encryptData: string, data: string): Promise<boolean> {
        return this.connection.compare(data, encryptData);
    }
}
