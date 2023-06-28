import { Request, Response } from "express";
import { CreateProfileAccountUseCase } from "../usecases/CreateProfileAccountUseCase";
import { AccountProfileRepositoryDatabase } from "../../infra/repositories/AccountProfileRepositoryDatabase";
import { create_profile_schema } from "../../utils/ZodSchemas";

export class CreateProfileAccountUseCaseController {
    async handle(request: Request, response: Response): Promise<Response> {
        const accountProfileRepositoryDatabase = new AccountProfileRepositoryDatabase();
        const createProfileAccountUseCase = new CreateProfileAccountUseCase(accountProfileRepositoryDatabase);

        const input = create_profile_schema.parse(request.body);

        const output = await createProfileAccountUseCase.execute(input);

        return response.status(200).json(output);
    }
}
