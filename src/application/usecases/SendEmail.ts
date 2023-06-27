import { Queue } from "../../infra/queue/Queue";
import { IMailerRepository } from "../RepositoriesContracts/IMailerRepository";

export class SendEmail {
    constructor(private readonly mailerRepository: IMailerRepository, private readonly queue: Queue) {}

    async execute(input: Input): Promise<void> {
        await this.mailerRepository.sendEmail(input.client_email, input.message);
    }
}

type Input = {
    client_email: string;
    subject: string;
    message: string;
};
