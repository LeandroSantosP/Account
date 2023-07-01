import { CreateAccountController } from "../../../application/controllers/CreateAccountController";
import { CreateProfileAccountUseCaseController } from "../../../application/controllers/CreateProfileAccountUseCaseController";
import { DepositAccountController } from "../../../application/controllers/DepositAccountControoler";
import { GetAccountController } from "../../../application/controllers/GetAccountController";
import { WithDrawAccountController } from "../../../application/controllers/WithDrawController";
import { Queue } from "../../queue/Queue";
import { Http } from "./Http";

export class Routers {
    constructor(private readonly http: Http, private readonly queue: Queue) {
        this.http.public("post", "/profile-account", async (request: any, response: any) => {
            const controller = new CreateProfileAccountUseCaseController();
            return await controller.handle(request, response);
        });

        this.http.public("post", "/account", async (request: any, response: any) => {
            const controller = new CreateAccountController(this.queue);
            return await controller.handle(request, response);
        });

        this.http.public("get", "/account/:client_id", async (request: any, response: any) => {
            const controller = new GetAccountController();
            return await controller.handle(request, response);
        });

        this.http.public("post", "/deposit", async (request: any, response: any) => {
            const controller = new DepositAccountController();
            return await controller.handle(request, response);
        });

        this.http.public("post", "/withdraw", async (request: any, response: any) => {
            const controller = new WithDrawAccountController();
            return await controller.handle(request, response);
        });
    }
}
