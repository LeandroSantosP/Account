import { Account } from "../../src/domain/Account";
import { DepositAccountUseCase } from "../../src/application/usecases/DepositAccountUseCase";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";
import { Currency, Input, Output } from "../../src/interfaces/Currency";
import { AccountRepositoryDatabase } from "../../src/infra/repositories/AccountRepositoryDatabase";
import { randomUUID } from "crypto";
import { AccountProfileRepositoryDatabase } from "../../src/infra/repositories/AccountProfileRepositoryDatabase";
import { AccountProfile } from "../../src/domain/AccountProfile";
import { Address } from "../../src/domain/Address";
import { cleanDatabase } from "../setup";

const fakeCurrency: Currency = {
    async calculate(input: Input): Promise<Output> {
        return {
            code: "USD",
            price: 4,
        };
    },
};

beforeEach(async () => {
    await cleanDatabase();
});

test("Deve Fazer um deposito em uma conta de 12000", async () => {
    const client_id = randomUUID();
    const account = Account.create(client_id, "João", "joao@gmail.com", 10, new Date("2023-06-21"));

    const accountRepository = new AccountRepositoryInMemory();
    accountRepository.accounts = [account];

    const depositAccount = new DepositAccountUseCase(accountRepository, fakeCurrency);

    const input = {
        account_code: "202300000010",
        amount: 12000,
        deposit_date: "2023-09-10",
    };

    const output = await depositAccount.execute(input);

    expect(output.deposit_date).toEqual(new Date("2023-09-10"));
    expect(output.current_balance).toEqual(12000);
});

test("Deve Fazer um deposito em dólar/americano e converter automaticamente para BRL (real).", async () => {
    const client_id = randomUUID();

    const accountProfileRepository = new AccountProfileRepositoryDatabase();

    await accountProfileRepository.save(
        new AccountProfile("João", "joao@gmail.com", "senha123", new Address("Rua ,1", 100, "Sao paulo"), client_id)
    );

    const accountRepository = new AccountRepositoryDatabase();
    const account = Account.create(client_id, "João", "joao@gmail.com", 10, new Date("2023-06-21"));

    await account.deposit(1000, new Date("2023-06-21"), new Date("2023-06-21"), "BRL", fakeCurrency);

    await accountRepository.save(account);

    const depositAccount = new DepositAccountUseCase(accountRepository, fakeCurrency);

    const input = {
        account_code: "202300000010",
        amount: 2000,
        deposit_date: "2023-09-10",
        currency: "USD",
    };

    const output = await depositAccount.execute(input);

    const clientWithNewBalance = await accountRepository.getAccountByClientId(client_id);

    expect(clientWithNewBalance).toBeDefined();
    expect(clientWithNewBalance!.balance.value).toBe(9000);

    expect(output.deposit_date).toEqual(new Date("2023-09-10"));
    expect(output.current_balance).toEqual(9000);

    await accountRepository.close();
});
