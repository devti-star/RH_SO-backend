
export class CachedNotSaveException extends Error
{
    constructor()
    {
        super("Sem valor salvo pelo Cache");
    }
}