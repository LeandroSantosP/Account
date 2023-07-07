import { randomUUID } from "crypto";
import { WithDrawAccountUseCase } from "../../src/application/usecases/WithDrawUseCase";
import { Account } from "../../src/domain/Account";
import { AccountRepositoryDatabase } from "../../src/infra/repositories/AccountRepositoryDatabase";
import { Currency, Input, Output } from "../../src/interfaces/Currency";
import { AccountProfileRepositoryDatabase } from "../../src/infra/repositories/AccountProfileRepositoryDatabase";
import { AccountProfile } from "../../src/domain/AccountProfile";
import { Address } from "../../src/domain/Address";
import { IAccountProfileRepository } from "../../src/application/RepositoriesContracts/IAccountProfileRepository";
import { IAccountRepository } from "../../src/application/RepositoriesContracts/IAccountRepository";
import { cleanDatabase } from "../setup";
import { CustomError } from "../../src/infra/http/middlewares/CustomError";

const fakeCurrency: Currency = {
    async calculate(input: Input): Promise<Output> {
        return {
            code: "BRL",
            price: 1,
        };
    },
};

let accountProfileRepository: IAccountProfileRepository;
let accountRepository: IAccountRepository;

beforeEach(async () => {
    await cleanDatabase();

    accountProfileRepository = new AccountProfileRepositoryDatabase();
    accountRepository = new AccountRepositoryDatabase();
});
test("Deve sacar um 2000 de uma conta", async () => {
    const client_id = randomUUID();

    await accountProfileRepository.save(
        new AccountProfile("João", "joao@gmail.com", "senha123", new Address("Rua ,1", 100, "Sao paulo"), client_id)
    );

    // const accountRepository = new AccountRepositoryInMemory();
    const newAccount = Account.create(client_id, "JohnDoe", "JohnDoe@gmail.com", 1, new Date("2023-06-21"));

    await newAccount.deposit(5000, new Date(), new Date(), "BRL", fakeCurrency);
    await accountRepository.save(newAccount);

    const withDrawAccount = new WithDrawAccountUseCase(accountRepository);

    const input = {
        account_code: "202300000001",
        amount: 2000,
        withdraw_date: "2023-07-21",
    };

    await withDrawAccount.execute(input);
    const output = await withDrawAccount.execute(input);

    expect(output.withdraw_date).toEqual(new Date("2023-07-21"));
    expect(output.current_balance).toEqual(1000);
});

test("Nao Deve ser possível sacar um valor maior que o saldo!", async () => {
    const client_id = randomUUID();

    const accountProfileRepository = new AccountProfileRepositoryDatabase();

    await accountProfileRepository.save(
        new AccountProfile("João", "joao@gmail.com", "senha123", new Address("Rua ,1", 100, "Sao paulo"), client_id)
    );

    const accountRepository = new AccountRepositoryDatabase();
    const newAccount = Account.create(client_id, "JohnDoe", "JohnDoe@gmail.com", 1, new Date("2023-06-21"));

    // const accountRepository = new AccountRepositoryInMemory();

    await newAccount.deposit(1000, new Date(), new Date(), "BRL", fakeCurrency);
    await accountRepository.save(newAccount);

    const withDrawAccount = new WithDrawAccountUseCase(accountRepository);

    const input = {
        account_code: "202300000001",
        amount: 2000,
        withdraw_date: "2023-07-21",
    };

    await expect(() => withDrawAccount.execute(input)).rejects.toThrow(
        new CustomError("Does not have this amount (2000) to withdraw, current account balance (1000).")
    );
});

afterAll(async () => {
    await accountProfileRepository.close();
    await accountRepository.close();
});
