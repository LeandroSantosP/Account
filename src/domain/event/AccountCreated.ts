export class AccountCreated {
    constructor(readonly client_email: string, readonly subject: string, readonly message: string) {}
}
