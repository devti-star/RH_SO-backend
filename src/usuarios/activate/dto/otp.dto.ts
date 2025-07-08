import { IsString, Length } from "class-validator";

export class OtpDto
{
    @IsString()
    @Length(6)
    otpCode:string; 
}