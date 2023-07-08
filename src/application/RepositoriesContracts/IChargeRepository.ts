import { Charge } from "../../domain/Charge";

export interface IChargeRepository {
    save(charge: Charge): Promise<void>;
    get(charge_id: string): Promise<Charge>;
    listByClientCode(code: string): Promise<Charge[]>;
    updated(charge: Charge): Promise<void>;
}
