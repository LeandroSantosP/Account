import { Http } from "./Http";
import "express-async-errors";
import express, { Express } from "express";
import { ErrorHandler } from "../middlewares/ErrorHandler";
import { logger } from "../../../utils/logger";
const errorHandler = new ErrorHandler();

export class ExpressAdapter implements Http {
    connection: Express;
    constructor() {
        const app = express();
        app.use(express.json());
        this.connection = app;
    }

    private middlewares() {
        this.connection.use(errorHandler.execute);
    }

    public(method: "post" | "get" | "put" | "delete", url: string, callback: Function): void {
        this.connection[method](url, async (request, response) => {
            await callback(request, response);
        });
    }

    async listen(): Promise<void> {
        this.middlewares();
        this.connection.listen(3000, () => {
            logger.info("Server running on port 3000");
        });
    }
}
