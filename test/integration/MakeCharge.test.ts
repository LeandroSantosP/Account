import { Account } from "../../src/domain/Account";
import { RepositoryFactoryMemory } from "../../src/infra/factory/RepositoryFactoryMemory";
import { MackChargeUsecase } from "../../src/application/usecases/MackChargeUsecase";

test("Deve realizar uma Cobrança", async function () {
    const repositoryFactory = new RepositoryFactoryMemory();

    const chargeRepository = repositoryFactory.chargeRepository();
    const accountRepository = repositoryFactory.accountRepository();
    const newAccount = Account.create("1", "JohnDoe", "johnDoe@gmail.com", 1, new Date("2022-12-10"));

    accountRepository.accounts = [newAccount];

    const makeCharge = new MackChargeUsecase(repositoryFactory);

    const input = {
        account_code: newAccount.getCode(),
        amount: 1000,
        description: "Cobrança teste",
    };

    const output = await makeCharge.execute(input);
    const output_2 = await makeCharge.execute(input);

    const charge = await chargeRepository.listByClientCode(newAccount.getCode());

    expect(charge.length).toBe(2);
    expect(output.amount).toBe(1000);
    expect(output.date).toBeInstanceOf(Date);
    expect(output.status).toBe("waiting_funds");
});
