export interface IMailerRepository {
    sendEmail(to: string, message: string): Promise<void>;
}
