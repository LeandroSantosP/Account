import { TransferAccountUseCase } from "../../src/application/usecases/TransferAccountUseCase";
import { Account } from "../../src/domain/Account";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";

test("Deve ser possível transferir uma valor de uma conta para o outra", async () => {
    const accountRepository = new AccountRepositoryInMemory();

    const account_one = Account.create("1", "João", "joao@gmail.com", 1, new Date("2023-06-21"));
    account_one.deposit(2000);
    const account_two = Account.create("2", "Maria", "maria@gmail.com", 2, new Date("2023-06-21"));
    account_two.deposit(2000);

    await accountRepository.save(account_one);
    await accountRepository.save(account_two);

    const transferAccount = new TransferAccountUseCase(accountRepository);

    const input = {
        from: "202300000001",
        to: "202300000002",
        amount: 2000,
        transfer_date: "2023-08-21",
    };

    await transferAccount.execute(input);

    expect(accountRepository.accounts[0].getBalance()).toBe(0);
    expect(accountRepository.accounts[1].getBalance()).toBe(4000);
});
