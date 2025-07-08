import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto{
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}