import { Account } from "../../src/domain/Account";
import { TransferAccount } from "../../src/domain/TransferAccount";
import { Currency, Input, Output } from "../../src/interfaces/Currency";

const fakeCurrency: Currency = {
    async calculate(input: Input): Promise<Output> {
        return {
            code: "USD",
            price: 10,
        };
    },
};

test("Deve ser possível transferir uma valor de uma conta para a outra", async () => {
    const account_from = Account.create("1", "João", "joao@gmail.com", 1, new Date("2023-06-21"));
    await account_from.deposit(2000, new Date(), new Date(), "BRL", fakeCurrency);

    const account_to = Account.create("2", "Maria", "maria@gmail.com", 1, new Date("2023-06-21"));
    await account_to.deposit(2000, new Date(), new Date(), "BRL", fakeCurrency);

    const transferAccount = TransferAccount.execute(account_from, account_to);
    await transferAccount.transfer(2000, new Date("2023-07-21"), fakeCurrency);

    expect(account_from.getBalance()).toBe(0);
    expect(account_to.getBalance()).toBe(4000);
});
