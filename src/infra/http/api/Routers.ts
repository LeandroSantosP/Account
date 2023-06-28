import { CreateProfileAccountUseCaseController } from "../../../application/controllers/CreateProfileAccountUseCaseController";
import { Http } from "./Http";

export class Routers {
    constructor(private readonly http: Http) {
        this.http.public("post", "/profile-account", async (request: any, response: any) => {
            const controller = new CreateProfileAccountUseCaseController();
            return await controller.handle(request, response);
        });
    }
}
