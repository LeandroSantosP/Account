import { randomUUID } from "crypto";
import { Address } from "./Address";
import { hash } from "bcrypt";

export class AccountProfile {
    id: string;
    constructor(public name: string, public email: string, public password: string, private readonly address: Address) {
        this.id = randomUUID();
    }
}
