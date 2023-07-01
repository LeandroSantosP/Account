import { SendEmail } from "./application/usecases/SendEmail";
import { ExpressAdapter } from "./infra/http/api/ExpressAdapter";
import { Routers } from "./infra/http/api/Routers";
import { QueueController } from "./infra/queue/QueueController";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { MailerRepositoryInMemory } from "./infra/repositories/MeilerRepositoryInMemory";
import dovEnv from "dotenv";
dovEnv.config();

async function main() {
    const http = new ExpressAdapter();

    const queue = RabbitMQAdapter.getInstance();
    await queue.connect();

    const sendEmailInMemory = new MailerRepositoryInMemory();

    const sendEmail = new SendEmail(sendEmailInMemory, queue);

    new QueueController(sendEmail, queue);

    new Routers(http, queue);

    await http.listen();
}

main();
