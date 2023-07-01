import { Account } from "../../src/domain/Account";
import { Currency, Input, Output } from "../../src/interfaces/Currency";

interface IAccountTest {
    id: string;
    name: string;
    email?: string;
    created_at?: Date;
    current_date?: Date;
    sequence?: number;
}

const fakeCurrency: Currency = {
    async calculate(input: Input): Promise<Output> {
        return {
            code: "USD",
            price: 10,
        };
    },
};

const AlexAccountTest = ({
    id,
    name,
    email = "alex@gmail.com",
    created_at = new Date("2023-06-21"),
    sequence = 1,
}: IAccountTest) => {
    return Account.create(id, name, email, sequence, created_at);
};

test("Deve criar um conta", () => {
    const created_at = new Date("2023-06-21");
    const account = AlexAccountTest({ id: "123", name: "Alex", created_at });

    expect(account.client_id).toBe("123");
    expect(account.created_at).toEqual(created_at);
    expect(account.name).toBe("Alex");
});

test("Deve ser criar uma conta con saldo 0", () => {
    const account = AlexAccountTest({ id: "123", name: "Alex" });
    const balance = account.getBalance();
    expect(balance).toBe(0);
});

test("Deve ser possível depositar uma 100 e retornar a data de Deposito", async () => {
    const account = AlexAccountTest({
        id: "123",
        name: "Alex",
    });
    const deposit_date = new Date("2023-07-21");
    const output = await account.deposit(100, deposit_date, deposit_date, "BRL", fakeCurrency);
    const balance = account.getBalance();

    expect(output!.deposit_date).toEqual(new Date("2023-07-21"));
    expect(balance).toBe(100);
});
/*  */
test("Nao deve se depositar com uma data invalida!", async () => {
    const current_date = new Date("2023-06-21");
    const account = AlexAccountTest({
        id: "123",
        name: "Alex",
        current_date,
    });
    const deposit_date = new Date("2023-01-21");

    await expect(() => account.deposit(100, deposit_date, new Date(), "BRL", fakeCurrency)).rejects.toThrow(
        new Error(`Deposit date (${deposit_date}) is invalid, must be future date!`)
    );
});

test("Nao deve ser possível depositar uma valor negativo", async () => {
    const account = AlexAccountTest({ id: "123", name: "Alex" });
    const date = new Date("2023-07-21");
    await expect(() => account.deposit(-100, date, date, "BRL", fakeCurrency)).rejects.toThrow(
        new Error("Deposit -100 is invalid, must be positive value!")
    );
});

test("Deve ser possível Sacar 100 de uma conta com saldo 1000 e retornar a data do saque", () => {
    const account = AlexAccountTest({ id: "123", name: "Alex" });
    account.balance.value = 1000;
    const operation_date = new Date("2023-07-21");

    const output = account.withdraw(100, operation_date, operation_date);
    const balance = account.getBalance();

    expect(output.withdraw_date).toBe(operation_date);
    expect(output.amount).toBe(100);
    expect(balance).toBe(900);
});

test("Nao deve ser possível sacar uma valor negativo", () => {
    const account = AlexAccountTest({ id: "123", name: "Alex" });
    const withdraw_date = new Date("2023-07-21");

    expect(() => account.withdraw(-100, withdraw_date)).toThrow(
        new Error("Withdraw -100 is invalid, must be positive value!")
    );
});

test("Nao deve ser possível sacar uma valor no qual o client nao tem disponível", async () => {
    const account = AlexAccountTest({ id: "123", name: "Alex" });
    const withdraw_date = new Date("2023-07-21");

    await account.deposit(1000, withdraw_date, withdraw_date, "BRL", fakeCurrency);
    expect(() => account.withdraw(2000, withdraw_date)).toThrow(
        new Error(`Does not have this amount (2000) to withdraw, current account balance (1000).`)
    );
});

test("Nao deve se sacar com uma data invalida!", () => {
    const current_date = new Date("2023-06-21");
    const account = AlexAccountTest({
        id: "123",
        name: "Alex",
        current_date,
    });
    account.balance.value = 2000;
    const withdraw_date = new Date("2023-01-21");

    expect(() => account.withdraw(1000, withdraw_date)).toThrow(
        Error(`Withdraw date (${withdraw_date}) is invalid, must be future date!`)
    );
});

test("Deve Fazer o deposito com base na currency (USD)", async () => {
    const current_date = new Date("2023-06-21");

    const fakeCurrency: Currency = {
        async calculate(input: Input): Promise<Output> {
            return {
                code: "USD",
                price: 10,
            };
        },
    };

    const account = Account.create("123", "João", "joao@gmail.com", 1, current_date);

    await account.deposit(1000, current_date, current_date, "USD", fakeCurrency);

    expect(account.balance.value).toBe(10000);
});
