import { AccountProfile } from "../../domain/AccountProfile";

export interface IAccountProfileRepository {
    save(AccountProfile: AccountProfile): Promise<void>;
    getByEmail(email: string): Promise<AccountProfile | null>;
    getClientId(id: string): Promise<AccountProfile | null>;
    close(): Promise<void>;
}
