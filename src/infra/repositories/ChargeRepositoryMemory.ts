import { IChargeRepository } from "../../application/RepositoriesContracts/IChargeRepository";
import { Charge } from "../../domain/Charge";

export class ChargeRepositoryMemory implements IChargeRepository {
    charges: Charge[] = [];

    static instance: ChargeRepositoryMemory;

    static getInstance() {
        if (!ChargeRepositoryMemory.instance) {
            ChargeRepositoryMemory.instance = new ChargeRepositoryMemory();
        }
        return ChargeRepositoryMemory.instance;
    }

    async get(charge_id: string): Promise<Charge> {
        const charge = this.charges.find((charge) => charge.id === charge_id);

        if (!charge) throw new Error("Charge not found");

        return charge;
    }
    async save(charge: Charge): Promise<void> {
        this.charges.push(charge);
    }

    async getByClientCode(code: string): Promise<Charge> {
        const charge = this.charges.find((charge) => charge.client_code === code);
        if (!charge) throw new Error("Charge not found");

        return charge;
    }

    async listByClientCode(code: string): Promise<Charge[]> {
        return this.charges.filter((charge) => charge.client_code === code);
    }
}
