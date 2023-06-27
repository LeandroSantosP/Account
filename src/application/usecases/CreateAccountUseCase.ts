import { Account } from "../../domain/Account";
import { AccountCreated } from "../../domain/event/AccountCreated";
import { Queue } from "../../infra/queue/Queue";
import { IAccountRepository } from "../RepositoriesContracts/IAccountRepository";

export class CreateAccountUseCase {
    constructor(private readonly accountRepository: IAccountRepository, private readonly queue: Queue) {}

    async execute(input: Input): Promise<void> {
        const account_exists = await this.accountRepository.getAccountByClientId(input.client_id);
        if (account_exists) throw new Error("Account already exists");
        const sequence = await this.accountRepository.getSequence();
        const newAccount = Account.create(input.client_id, input.owner_name, input.email, sequence);
        await this.accountRepository.save(newAccount);

        const AccountCreatedInput = {
            email: input.email,
            subject: "Criação de conta Efetuado com secesso!",
            message: `Parabéns ${input.owner_name}, sua conta foi criada com sucesso!`,
        };
        const accountCreated = new AccountCreated(
            AccountCreatedInput.email,
            AccountCreatedInput.subject,
            AccountCreatedInput.message
        );

        await this.queue.publisher("AccountCreated", accountCreated);
    }
}

type Input = {
    client_id: string;
    owner_name: string;
    email: string;
};
