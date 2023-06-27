import { SendEmail } from "../../application/usecases/SendEmail";
import { AccountCreated } from "../../domain/event/AccountCreated";
import { Queue } from "./Queue";

export class QueueController {
    constructor(private readonly sendEmail: SendEmail, readonly queue: Queue) {
        queue.consume("AccountCreated", async (message: AccountCreated) => {
            await this.sendEmail.execute(message);
        });
    }
}
