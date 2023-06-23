import { CreateAccountUseCase } from "../../src/application/usecases/CreateAccountUseCase";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";

test("Deve criar uma nova conta", async () => {
  const repositoryInMemory = new AccountRepositoryInMemory();
  const createAccount = new CreateAccountUseCase(repositoryInMemory);

  const input = {
    client_id: "123",
    owner_name: "João",
  };

  expect(await createAccount.execute(input)).toBeUndefined();

  expect(repositoryInMemory.accounts).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        client_id: "123",
        name: "João",
        balance: {
          value: 0,
        },
      }),
    ])
  );
});

test("Nao Deve criar uma nova conta caso ela ja exista!", async () => {
  const repositoryInMemory = new AccountRepositoryInMemory();
  const createAccount = new CreateAccountUseCase(repositoryInMemory);

  const input = {
    client_id: "123",
    owner_name: "João",
  };

  await createAccount.execute(input);

  await expect(() => createAccount.execute(input)).rejects.toThrow(
    new Error("Account already exists")
  );
});
