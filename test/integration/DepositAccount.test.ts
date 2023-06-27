import { Account } from "../../src/domain/Account";
import { DepositAccountUseCase } from "../../src/application/usecases/DepositAccountUseCase";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";

test("Deve Fazer um deposito em uma conta de 12000", async () => {
    const accountRepository = new AccountRepositoryInMemory();
    accountRepository.accounts = [Account.create("1", "João", "joao@gmail.com", 10, new Date("2023-06-21"))];

    const depositAccount = new DepositAccountUseCase(accountRepository);

    const input = {
        account_code: "202300000010",
        amount: 12000,
        deposit_date: "2023-09-10",
    };

    const output = await depositAccount.execute(input);

    expect(output.deposit_date).toEqual(new Date("2023-09-10"));
    expect(output.current_balance).toEqual(12000);
});
