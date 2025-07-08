import { NotFoundException } from "@nestjs/common";

export class CachedNotValueException extends NotFoundException
{
    constructor()
    {
        super("Sem valor retornando pelo Cache");
    }
}