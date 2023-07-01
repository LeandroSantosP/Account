import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "./CustomError";

export class ErrorHandler {
    async execute(erro: Error, request: Request, response: Response, next: NextFunction) {
        if (erro instanceof ZodError) {
            return response.status(400).json(erro.issues);
        }

        if (erro instanceof CustomError) {
            return response.status(erro.status).json({
                message: erro.message,
            });
        }

        console.log(erro);

        return response.status(500).json({
            message: "Internal server error",
            erro,
        });
    }
}
