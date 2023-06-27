import { IMailerRepository } from "../../application/RepositoriesContracts/IMailerRepository";

export class MailerRepositoryInMemory implements IMailerRepository {
    mensagensSended: { to: string; message: string }[] = [];

    async sendEmail(to: string, message: string): Promise<void> {
        this.mensagensSended.push({ to: to, message: message });
    }
}
