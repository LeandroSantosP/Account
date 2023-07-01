import { randomUUID } from "crypto";
import { Account } from "../../src/domain/Account";
import { IAccountRepository } from "../../src/application/RepositoriesContracts/IAccountRepository";
import { GetAccountUseCase } from "../../src/application/usecases/GetAccountUseCase";
import { AccountRepositoryInMemory } from "../../src/infra/repositories/AccountRepositoryInMemory";
import { CustomError } from "../../src/infra/http/middlewares/CustomError";

let accountRepository: IAccountRepository;

beforeEach(async () => {
    accountRepository = new AccountRepositoryInMemory();
});
test("Deve obter uma conta.", async () => {
    const client_id = randomUUID();
    const newAccount = Account.create(client_id, "JohnDoe", "johnDoe@gmail.com", 1, new Date("2022-12-10"));
    console.log(newAccount.getCode());
    await accountRepository.save(newAccount);

    const getAccount = new GetAccountUseCase(accountRepository);

    const output = await getAccount.execute(client_id);

    expect(output.name).toBe("JohnDoe");
    expect(output.code).toBe("202200000001");
});

test("Deve lancar um erro caso a conta nao exista!", async () => {
    const client_id = randomUUID();
    const newAccount = Account.create(client_id, "JohnDoe", "johnDoe@gmail.com", 1, new Date("2022-12-10"));
    await accountRepository.save(newAccount);

    const getAccount = new GetAccountUseCase(accountRepository);

    await expect(getAccount.execute("invalid")).rejects.toThrow(new CustomError("Account not found"));
});
