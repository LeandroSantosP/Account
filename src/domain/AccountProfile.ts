import { randomUUID } from "crypto";
import { Address } from "./Address";
import { Crypto } from "../interfaces/Crypto";
import { BcryptAdepter } from "../interfaces/BcryptAdapter";

export class AccountProfile {
    id: string;
    constructor(
        public readonly name: string,
        public readonly email: string,
        public password: string,
        readonly address: Address,
        id: string = randomUUID(),
        private readonly encrypt: Crypto = new BcryptAdepter()
    ) {
        this.id = id;
    }

    async encryptPassword() {
        this.password = await this.encrypt.encrypt(this.password);
    }

    async verify(password: string) {
        return await this.encrypt.verify(this.password, password);
    }
}
