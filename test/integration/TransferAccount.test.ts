import { randomUUID } from "crypto";
import { TransferAccountUseCase } from "../../src/application/usecases/TransferAccountUseCase";
import { Account } from "../../src/domain/Account";
import { AccountRepositoryDatabase } from "../../src/infra/repositories/AccountRepositoryDatabase";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";
import { Currency, Input, Output } from "../../src/interfaces/Currency";
import { cleanDatabase } from "../setup";
import { AccountProfileRepositoryDatabase } from "../../src/infra/repositories/AccountProfileRepositoryDatabase";
import { AccountProfile } from "../../src/domain/AccountProfile";
import { Address } from "../../src/domain/Address";

const fakeCurrency: Currency = {
    async calculate(input: Input): Promise<Output> {
        return {
            code: "BRL",
            price: 1,
        };
    },
};

beforeEach(async () => {
    await cleanDatabase();
});
test("Deve ser possível transferir uma valor de uma conta para o outra", async () => {
    const client_id_one = randomUUID();
    const client_id_two = randomUUID();
    const accountProfileRepository = new AccountProfileRepositoryDatabase();

    await accountProfileRepository.save(
        new AccountProfile("João", "joao@gmail.com", "senha123", new Address("Rua ,1", 100, "Sao paulo"), client_id_one)
    );

    await accountProfileRepository.save(
        new AccountProfile(
            "Maria",
            "maria@gmail.com",
            "senha123",
            new Address("Rua ,1", 100, "Sao paulo"),
            client_id_two
        )
    );

    // const accountRepository = new AccountRepositoryInMemory();
    const accountRepository = new AccountRepositoryDatabase();

    const account_one = Account.create(client_id_one, "João", "joao@gmail.com", 1, new Date("2023-06-21"));
    await account_one.deposit(2000, new Date(), new Date(), "BRL", fakeCurrency);

    const account_two = Account.create(client_id_two, "Maria", "maria@gmail.com", 2, new Date("2023-06-21"));
    await account_two.deposit(2000, new Date(), new Date(), "BRL", fakeCurrency);

    await accountRepository.save(account_one);
    await accountRepository.save(account_two);
    const transferAccount = new TransferAccountUseCase(accountRepository, fakeCurrency);

    const input = {
        from: "202300000001",
        to: "202300000002",
        amount: 2000,
        transfer_date: "2023-08-21",
    };

    await transferAccount.execute(input);
    const first_account = await accountRepository.getAccountByCode(account_one.getCode());
    const second_account = await accountRepository.getAccountByCode(account_two.getCode());

    expect(first_account.getBalance()).toBe(0);
    expect(second_account.getBalance()).toBe(4000);
});
