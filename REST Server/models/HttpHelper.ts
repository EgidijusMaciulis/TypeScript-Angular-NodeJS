import {Response} from "express";
import {Error} from "./Error";

export class HttpHelper {
    public static BadRequest(res: Response): void {
        res.status(400);
        res.send(new Error(400, "Bad request."));
    }

    public static Unauthorized(res: Response): void {
        res.status(403);
        res.send(new Error(403, "Unauthorized."));
    }

    public static InternalServerError(res: Response): void {
        res.status(500);
        res.send(new Error(500, "Internal server error."));
    }

    public static Ok(res: Response): void {
        res.status(201);
        res.send({status: 201, message: "OK"});
    }
}
