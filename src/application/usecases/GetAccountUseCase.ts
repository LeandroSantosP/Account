import { CustomError } from "../../infra/http/middlewares/CustomError";
import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";

export class GetAccountUseCase {
    constructor(private readonly accountRepository: IAccountRepository) {}
    async execute(client_id: string): Promise<OutPut> {
        const account = await this.accountRepository.getAccountByClientId(client_id);

        if (!account) {
            throw new CustomError("Account not found");
        }

        const output: OutPut = {
            ...account,
            balance: account.balance.value,
            code: account.getCode(),
        };
        return output;
    }
}

type OutPut = {
    client_id: string;
    name: string;
    balance: number;
    code: string;
};
