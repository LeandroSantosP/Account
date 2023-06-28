import { AccountProfile } from "../../domain/AccountProfile";
import { Address } from "../../domain/Address";
import { CustomError } from "../../infra/http/middlewares/CustomError";
import { IAccountProfileRepository } from "../RepositoriesContracts/IAccountProfileRepository";

export class CreateProfileAccountUseCase {
    constructor(private readonly createProfileAccountRepository: IAccountProfileRepository) {}

    async execute(input: Input): Promise<Output> {
        const account_exists = await this.createProfileAccountRepository.getByEmail(input.email);
        if (account_exists) {
            throw new CustomError("This Email already Register!");
        }

        const address = new Address(input.address.street, input.address.number, input.address.city);
        const account = new AccountProfile(input.name, input.email, input.password, address);
        await account.encryptPassword();

        await this.createProfileAccountRepository.save(account);
        return {
            account_profile_id: account.id,
        };
    }
}

type Input = {
    name: string;
    email: string;
    password: string;
    address: {
        street: string;
        number: number;
        city: string;
    };
};

type Output = {
    account_profile_id: string;
};
