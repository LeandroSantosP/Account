import { Account } from "../../src/domain/Account";
import { TransferAccount } from "../../src/domain/TransferAccount";

test("Deve ser possível transferir uma valor de uma conta para a outra", () => {
    const account_from = new Account("1", "João", 1, new Date("2023-06-21"), "");
    account_from.deposit(2000);
    const account_to = new Account("2", "Maria", 2, new Date("2023-06-21"), "joao@gmail.com");
    account_to.deposit(2000);

    const transferAccount = TransferAccount.execute(account_from, account_to);
    transferAccount.transfer(2000, new Date("2023-07-21"));

    expect(account_from.getBalance()).toBe(0);
    expect(account_to.getBalance()).toBe(4000);
});
