import { WithDrawAccountUseCase } from "../../src/application/usecases/WithDrawUseCase";
import { Account } from "../../src/domain/Account";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";

test("Deve sacar um 2000 de uma conta", async () => {
    const accountRepository = new AccountRepositoryInMemory();

    const newAccount = new Account("123", "JohnDoe", 1, new Date("2023-06-21"), "JohnDoe@gmail.com");
    newAccount.deposit(5000);
    //Account.create("2", "Maria", "maria@gmail.com", 2, new Date("2023-06-21"));
    await accountRepository.save(newAccount);

    const withDrawAccount = new WithDrawAccountUseCase(accountRepository);

    const input = {
        account_code: "202300000001",
        amount: 2000,
        withdraw_date: "2023-07-21",
    };

    const output = await withDrawAccount.execute(input);

    expect(output.withdraw_date).toEqual(new Date("2023-07-21"));
    expect(output.current_balance).toEqual(3000);
});

test("Nao Deve ser possível sacar um valor maior que o saldo!", async () => {
    const accountRepository = new AccountRepositoryInMemory();

    const newAccount = new Account("123", "JohnDoe", 1, new Date("2023-06-21"), "JohnDoe@gmail.com");
    newAccount.deposit(1000);
    await accountRepository.save(newAccount);

    const withDrawAccount = new WithDrawAccountUseCase(accountRepository);

    const input = {
        account_code: "202300000001",
        amount: 2000,
        withdraw_date: "2023-07-21",
    };

    await expect(() => withDrawAccount.execute(input)).rejects.toThrow(
        new Error("Does not have this amount (2000) to withdraw, current account balance (1000).")
    );
});
