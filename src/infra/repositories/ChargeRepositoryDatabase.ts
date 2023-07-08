import { Knex } from "knex";
import { IChargeRepository } from "../../application/RepositoriesContracts/IChargeRepository";
import { knex_connection } from "../../database/knex";
import { Charge } from "../../domain/Charge";
import { ChargeWithTax } from "../../domain/ChargeWithTax";

export class ChargeRepositoryDatabase implements IChargeRepository {
    connection: Knex;

    constructor() {
        this.connection = knex_connection;
    }

    async save(charge: Charge): Promise<void> {
        await this.connection("charges").insert({
            id: charge.id,
            description: charge.description,
            amount: charge.amount,
            current_amount: charge.amount,
            client_code: charge.client_code,
            status: charge.status,
        });
    }

    async get(charge_id: string): Promise<Charge> {
        const [chargeData] = await this.connection("charges").where("charges.id", charge_id);
        if (!chargeData) throw new Error("Charge not found");

        const charge = ChargeWithTax.create(
            chargeData.description,
            chargeData.amount,
            parseFloat(chargeData.current_amount),
            chargeData.client_code,
            chargeData.created_at,
            chargeData.id
        );
        charge.status = chargeData.status;
        return charge;
    }

    async listByClientCode(code: string): Promise<Charge[]> {
        const [chargeData] = await this.connection("charges").select("*").where("charges.client_code", code);
        return [] as any;
    }

    async updated(charge: Charge): Promise<void> {
        await this.connection("charges").where("charges.id", charge.id).update({
            current_amount: charge.getCurrentAmount(),
            status: charge.status,
        });
    }

    async close() {
        await this.connection.destroy();
    }
}
