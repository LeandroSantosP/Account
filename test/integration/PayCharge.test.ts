import { randomUUID } from "crypto";
import { PayChargeUsecase } from "../../src/application/usecases/PayChargeUsecase";
import { knex_connection } from "../../src/database/knex";
import { ChargeWithTax } from "../../src/domain/ChargeWithTax";
import { RepositoryFactoryDatabase } from "../../src/infra/factory/RepositoryFactoryDatabase";
const repositoryFactory = new RepositoryFactoryDatabase();

beforeEach(async () => {
    await knex_connection.raw("DELETE FROM charges CASCADE");
});

test("Deve ser possível pagar uma cobrança", async function () {
    // const repositoryFactory = new RepositoryFactoryMemory();
    const charge_id = randomUUID();
    const charge = ChargeWithTax.create("test", 1000, 1000, "202300000001", new Date("2023-06-21"), charge_id);

    await repositoryFactory.chargeRepository().save(charge);

    const payCharge = new PayChargeUsecase(repositoryFactory);

    const input_one = {
        charge_id: charge_id,
        amount: 1000,
        date: "2023-07-21",
    };

    const output = await payCharge.execute(input_one);

    expect(output.rest_for_payment).toBe(0);

    expect((await repositoryFactory.chargeRepository().get(charge_id)).status).toBe("paid");

    await repositoryFactory.chargeRepository().close();
});

afterAll(async () => {
    await repositoryFactory.chargeRepository().close();
});
