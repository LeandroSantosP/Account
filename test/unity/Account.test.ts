import { Account } from "../../src/Account";
interface IAccountTest {
  id: string;
  name: string;
  created_at?: Date;
  current_date?: Date;
  sequence?: number;
}
const AlexAccountTest = ({
  id,
  name,
  created_at = new Date("2023-06-21"),
  current_date = new Date(),
  sequence = 1,
}: IAccountTest) => {
  return new Account(id, name, sequence, created_at, current_date);
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
  expect(balance.value).toBe(0);
});

test("Deve ser possível depositar uma 100 e retornar a data de Deposito", () => {
  const account = AlexAccountTest({
    id: "123",
    name: "Alex",
  });
  const deposit_date = new Date("2023-07-21");
  const output = account.deposit(100, deposit_date);
  const balance = account.getBalance();

  expect(output.deposit_date).toEqual(new Date("2023-07-21"));
  expect(balance.value).toBe(100);
});

test("Nao deve se depositar com uma data invalida!", () => {
  const current_date = new Date("2023-06-21");
  const account = AlexAccountTest({
    id: "123",
    name: "Alex",
    current_date,
  });
  const deposit_date = new Date("2023-01-21");
  expect(() => account.deposit(100, deposit_date)).toThrow(
    new Error(`Deposit date (${deposit_date}) is invalid, must be future date!`)
  );
});

test("Nao deve ser possível depositar uma valor negativo", () => {
  const account = AlexAccountTest({ id: "123", name: "Alex" });

  expect(() => account.deposit(-100)).toThrow(
    new Error("Deposit -100 is invalid, must be positive value!")
  );
});

test("Deve ser possível Sacar 100 de uma conta com saldo 1000 e retornar a data do saque", () => {
  const account = AlexAccountTest({ id: "123", name: "Alex" });
  account.balance.value = 1000;
  const operation_date = new Date("2023-07-21");

  const output = account.withdraw(100, operation_date);
  const balance = account.getBalance();

  expect(output.withdraw_date).toBe(operation_date);
  expect(output.amount).toBe(100);
  expect(balance.value).toBe(900);
});

test("Nao deve ser possível sacar uma valor negativo", () => {
  const account = AlexAccountTest({ id: "123", name: "Alex" });
  const withdraw_date = new Date("2023-07-21");

  expect(() => account.withdraw(-100, withdraw_date)).toThrow(
    new Error("Withdraw -100 is invalid, must be positive value!")
  );
});

test("Nao deve ser possível sacar uma valor no qual o client nao tem disponível", () => {
  const account = AlexAccountTest({ id: "123", name: "Alex" });
  const withdraw_date = new Date("2023-07-21");

  account.deposit(1000);
  expect(() => account.withdraw(2000, withdraw_date)).toThrow(
    new Error(
      `Does not have this amount (2000) to withdraw, current account balance (1000).`
    )
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
