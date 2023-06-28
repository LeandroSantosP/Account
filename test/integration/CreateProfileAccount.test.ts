import { CreateProfileAccountUseCase } from "../../src/application/usecases/CreateProfileAccountUseCase";
import { AccountProfileRepositoryDatabase } from "../../src/infra/repositories/AccountProfileRepositoryDatabase";
import { AccountProfileRepositoryInMemory } from "../../src/infra/repositories/AccountProfileRepositoryInMemory";
import { knex_connection } from "../../src/database/knex";
test("Deve criar uma Conta de Profile para um client", async () => {
    await knex_connection("account_profile").truncate();

    // const accountProfileRepository = new AccountProfileRepositoryInMemory();
    const repositoryDatabase = new AccountProfileRepositoryDatabase();

    const createProfileAccount = new CreateProfileAccountUseCase(repositoryDatabase);

    const input = {
        name: "Jon Doe",
        email: "jonDoe@gmail.com",
        password: "senha123",
        address: {
            street: "Rua 1",
            number: 123,
            city: "São Paulo",
        },
    };

    const output = await createProfileAccount.execute(input);
    expect(output.account_profile_id).toBeDefined();

    const res = await repositoryDatabase.getByEmail("jonDoe@gmail.com");

    expect(res).toBeDefined();

    await repositoryDatabase.close();
});
