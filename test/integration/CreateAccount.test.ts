import { randomUUID } from "crypto";
import { CreateAccountUseCase } from "../../src/application/usecases/CreateAccountUseCase";
import { AccountRepositoryDatabase } from "../../src/infra/repositories/AccountRepositoryDatabase";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";
import { knex_connection } from "../../src/database/knex";
import { IAccountRepository } from "../../src/application/RepositoriesContracts/IAccountRepository";
import { MailerRepositoryInMemory } from "../../src/infra/repositories/MeilerRepositoryInMemory";
import { RabbitMQAdapter } from "../../src/infra/queue/RabbitMQAdapter";
import { QueueController } from "../../src/infra/queue/QueueController";
import { SendEmail } from "../../src/application/usecases/SendEmail";

let rabbitMqAdapter: RabbitMQAdapter;
let accountRepository: IAccountRepository;

beforeEach(async () => {
    rabbitMqAdapter = RabbitMQAdapter.getInstance();
    await rabbitMqAdapter.connect();

    await knex_connection("account").truncate();
    accountRepository = new AccountRepositoryDatabase();
});

test("Deve criar uma nova conta", async () => {
    // const accountRepository = new AccountRepositoryInMemory();
    const createAccount = new CreateAccountUseCase(accountRepository, rabbitMqAdapter);
    const client_id = randomUUID();

    const input = {
        client_id: client_id,
        owner_name: "João",
        email: "joao@gmail.com",
    };
    expect(await createAccount.execute(input)).toBeUndefined();
    const new_client = await accountRepository.getAccountByClientId(client_id);

    expect(new_client).toBeDefined();
    expect(new_client?.client_id).toBe(client_id);
});

test("Nao Deve criar uma nova conta caso ela ja exista!", async () => {
    const repositoryInMemory = new AccountRepositoryInMemory();

    const createAccount = new CreateAccountUseCase(repositoryInMemory, rabbitMqAdapter);

    const input = {
        client_id: "123",
        owner_name: "João",
        email: "joao@gmail.com",
    };

    await createAccount.execute(input);

    await expect(() => createAccount.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar uma nova conta", async () => {
    const mailerRepositoryInMemory = new MailerRepositoryInMemory();
    // const accountRepository = new AccountRepositoryInMemory();
    const createAccount = new CreateAccountUseCase(accountRepository, rabbitMqAdapter);
    const client_id = randomUUID();

    const input = {
        client_id: client_id,
        owner_name: "João",
        email: "joao@gmail.com",
    };
    expect(await createAccount.execute(input)).toBeUndefined();
    const new_client = await accountRepository.getAccountByClientId(client_id);

    expect(new_client).toBeDefined();
    expect(new_client?.client_id).toBe(client_id);
});

test("Deve criar uma nova conta e enviar um email confirmando a cadastro!", async () => {
    const mailerRepositoryInMemory = new MailerRepositoryInMemory();
    const repositoryInMemory = new AccountRepositoryInMemory();

    const sendEmail = new SendEmail(mailerRepositoryInMemory, rabbitMqAdapter);
    new QueueController(sendEmail, rabbitMqAdapter);

    const createAccount = new CreateAccountUseCase(repositoryInMemory, rabbitMqAdapter);

    const input = {
        client_id: "123",
        owner_name: "João",
        email: "joao@gmail.com",
    };

    await createAccount.execute(input);

    await new Promise<void>((resolve) => {
        setTimeout(() => {
            expect(mailerRepositoryInMemory.mensagensSended[0].message).toBe(
                "Parabéns João, sua conta foi criada com sucesso!"
            );
            resolve();
        }, 400);
    });
});

afterAll(async () => {
    await accountRepository.close();
    await rabbitMqAdapter.connection.close();
});
