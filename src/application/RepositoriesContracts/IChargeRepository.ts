import { Charge } from "../../domain/Charge";

export interface IChargeRepository {
    save(charge: Charge): Promise<void>;
    get(charge_id: string): Promise<Charge>;
    getByClientCode(code: string): Promise<Charge>;
    listByClientCode(code: string): Promise<Charge[]>;
}
