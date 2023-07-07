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
import { AccountProfileRepositoryInMemory } from "../../src/infra/repositories/AccountProfileRepositoryInMemory";
import { AccountProfile } from "../../src/domain/AccountProfile";
import { Address } from "../../src/domain/Address";
import { AccountProfileRepositoryDatabase } from "../../src/infra/repositories/AccountProfileRepositoryDatabase";
import { IAccountProfileRepository } from "../../src/application/RepositoriesContracts/IAccountProfileRepository";

let rabbitMqAdapter: RabbitMQAdapter;
let accountRepository: IAccountRepository;
let accountProfileRepository: IAccountProfileRepository;

beforeEach(async () => {
    rabbitMqAdapter = RabbitMQAdapter.getInstance();
    await rabbitMqAdapter.connect();
    await knex_connection("account").truncate();
    await knex_connection.raw("TRUNCATE TABLE account_profile, address CASCADE");

    accountProfileRepository = new AccountProfileRepositoryDatabase();
    accountRepository = new AccountRepositoryDatabase();
});

test("Deve criar uma nova conta", async () => {
    const accountRepository = new AccountRepositoryInMemory();
    const client_id = randomUUID();

    await accountProfileRepository.save(
        new AccountProfile("João", "joao@gmail.com", "senha123", new Address("Rua 1", 100, "Sao paulo"), client_id)
    );
    const createAccount = new CreateAccountUseCase(accountRepository, rabbitMqAdapter, accountProfileRepository);

    const input = {
        client_id,
        owner_name: "João",
        email: "joao@gmail.com",
    };

    expect(await createAccount.execute(input)).toBeUndefined();
    const new_client = await accountRepository.getAccountByClientId(client_id);

    expect(new_client).toBeDefined();
    expect(new_client?.client_id).toBe(client_id);
    expect(new_client?.name).toBe("João");
    expect(new_client?.email).toBe("joao@gmail.com");
});

test("Nao Deve criar uma nova conta caso ela ja exista!", async () => {
    const repositoryInMemory = new AccountRepositoryInMemory();

    const accountProfileRepository = new AccountProfileRepositoryInMemory();
    const client_id = randomUUID();

    await accountProfileRepository.save(
        new AccountProfile("João", "joao@gmail.com", "senha123", new Address("Rua 1", 100, "Sao paulo"), client_id)
    );

    const createAccount = new CreateAccountUseCase(repositoryInMemory, rabbitMqAdapter, accountProfileRepository);

    const input = {
        client_id,
        owner_name: "João",
        email: "joao@gmail.com",
    };

    await createAccount.execute(input);

    await expect(() => createAccount.execute(input)).rejects.toThrowError("Account already exists");
});

test("Deve criar uma nova conta e enviar um email confirmando a cadastro!", async () => {
    const mailerRepositoryInMemory = new MailerRepositoryInMemory();

    const accountProfileRepository = new AccountProfileRepositoryInMemory();
    const accountRepositoryInMemory = new AccountRepositoryInMemory();
    const client_id = randomUUID();
    await accountProfileRepository.save(
        new AccountProfile("João", "joao@gmail.com", "senha123", new Address("Rua 1", 100, "Sao paulo"), client_id)
    );

    const sendEmail = new SendEmail(mailerRepositoryInMemory, rabbitMqAdapter);
    new QueueController(sendEmail, rabbitMqAdapter);

    const createAccount = new CreateAccountUseCase(
        accountRepositoryInMemory,
        rabbitMqAdapter,
        accountProfileRepository
    );

    const input = {
        client_id,
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
    await accountProfileRepository.close();
    await rabbitMqAdapter.connection.close();
});
