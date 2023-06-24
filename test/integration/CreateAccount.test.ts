import { randomUUID } from "crypto";
import { CreateAccountUseCase } from "../../src/application/usecases/CreateAccountUseCase";
import { AccountRepository } from "../../src/infra/repositories/AccountRepositoryDatabase";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";
import { knex_connection } from "../../src/database/knex";
import { IAccountRepository } from "../../src/application/RepositoriesContracts/IAccountRepository";

let accountRepository: IAccountRepository;

beforeEach(async () => {
  accountRepository = new AccountRepository();
  await knex_connection("account").truncate();
});

test("Deve criar uma nova conta", async () => {
  // const accountRepository = new AccountRepositoryInMemory();
  const createAccount = new CreateAccountUseCase(accountRepository);
  const client_id = randomUUID();

  const input = {
    client_id: client_id,
    owner_name: "João",
  };
  expect(await createAccount.execute(input)).toBeUndefined();
  const new_client = await accountRepository.getAccountByClientId(client_id);

  expect(new_client).toBeDefined();
  expect(new_client?.client_id).toBe(client_id);
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

afterAll(async () => {
  await accountRepository.close();
});
