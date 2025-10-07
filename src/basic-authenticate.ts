import { NextFunction } from "express";

// ref: https://stackoverflow.com/questions/23616371/basic-http-authentication-with-node-and-express-4

export function getBasicAuthenticate(userName: string, password: string) {
    return (req: any, res: any, next: NextFunction) => {

        const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
        const [headerUserName, headerPassword] = Buffer.from(b64auth, "base64").toString().split(":")

        if (headerUserName === userName && headerPassword === password) {
            return next();
        }

        res.set("WWW-Authenticate", `Basic realm="401"`) // change this
        res.status(401).send("Authentication required.") // custom message
    };
}