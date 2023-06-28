import { Request, Response } from "express";

import { CreateAccountUseCase } from "../usecases/CreateAccountUseCase";
import { AccountRepositoryDatabase } from "../../infra/repositories/AccountRepositoryDatabase";
import { RabbitMQAdapter } from "../../infra/queue/RabbitMQAdapter";
import { create_account_schema } from "../../utils/ZodSchemas";

export class CreateAccountController {
    async handle(request: Request, response: Response): Promise<Response> {
        const input = create_account_schema.parse(request.body);

        const accountRepository = new AccountRepositoryDatabase();
        const queue = new RabbitMQAdapter();

        const createAccount = new CreateAccountUseCase(accountRepository, queue);
        await createAccount.execute(input);

        return response.status(201).send();
    }
}
