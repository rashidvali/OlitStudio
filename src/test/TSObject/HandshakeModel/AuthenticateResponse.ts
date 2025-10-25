import { UserInfo } from "./UserInfo";

export class AuthenticateResponse
{
    Data: UserInfo;
    Token: string;
    Success: boolean;
    Message: string;
}