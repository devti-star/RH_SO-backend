import { Injectable } from "@nestjs/common";

@Injectable()
export class OtpGenerateService
{
    generateOtp(): String
    {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    }
}