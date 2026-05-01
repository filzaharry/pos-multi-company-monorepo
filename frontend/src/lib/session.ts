import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "pos_multi_company_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

// This is where we specify the typing of req.session
declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: string;
            token: string;
            email: string;
        };
    }
}
