import { IsNotEmpty, IsString } from "class-validator";

export class ForgotPassword{
    @IsString()
    @IsNotEmpty()
    email: string;
}