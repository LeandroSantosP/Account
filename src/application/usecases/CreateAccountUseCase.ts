import { Account } from "../../domain/Account";
import { AccountCreated } from "../../domain/event/AccountCreated";
import { CustomError } from "../../infra/http/middlewares/CustomError";
import { Queue } from "../../infra/queue/Queue";
import { IAccountProfileRepository } from "../RepositoriesContracts/IAccountProfileRepository";
import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";

export class CreateAccountUseCase {
    constructor(
        private readonly accountRepository: IAccountRepository,
        private readonly queue: Queue,
        private readonly accountProfileRepository: IAccountProfileRepository
    ) {}

    async execute(input: Input): Promise<void> {
        const account = await this.accountProfileRepository.getClientId(input.client_id);

        if (!account) throw new CustomError("Profile Account does not exists");

        const account_exists = await this.accountRepository.getAccountByClientId(input.client_id);

        if (account_exists) throw new CustomError("Account already exists");
        const sequence = await this.accountRepository.getSequence();

        const newAccount = Account.create(input.client_id, input.owner_name, input.email, sequence);
        await this.accountRepository.save(newAccount);

        const accountCreated = new AccountCreated(
            input.email,
            "Criação de conta Efetuado com secesso!",
            `Parabéns ${input.owner_name}, sua conta foi criada com sucesso!`
        );

        await this.queue.publisher("AccountCreated", accountCreated);
    }
}

type Input = {
    client_id: string;
    owner_name: string;
    email: string;
};
