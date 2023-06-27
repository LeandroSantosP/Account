import { CreateProfileAccountUseCase } from "../../src/application/usecases/CreateProfileAccountUseCase";
import { AccountProfileRepositoryInMemory } from "../../src/infra/repositories/AccountProfileRepositoryInMemory";

test("Deve criar uma Conta de Profile para um client", async () => {
    const accountProfileRepository = new AccountProfileRepositoryInMemory();
    const createProfileAccount = new CreateProfileAccountUseCase(accountProfileRepository);

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

    expect(accountProfileRepository.accounts).toHaveLength(1);
    expect(accountProfileRepository.accounts).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                email: "jonDoe@gmail.com",
            }),
        ])
    );
});
