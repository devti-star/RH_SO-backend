import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CachedNotValueException } from '../exceptions/cache-not-value.exception'
import { CachedNotSaveException } from '../exceptions/cache-not-save.exception'

@Injectable()
export class CachedService
{
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    async getCached(key:string):Promise<any>
    {
        const value = await this.cacheManager.get(key);
        if(!value) throw new CachedNotValueException();
        return value;
    }
    async setCached(key: string, value:number): Promise<boolean>
    {
        const r = await this.cacheManager.set(key, value);
        if(!r) throw new CachedNotSaveException();
        return true;
    }
    async deleteCached(key:string):Promise<boolean>
    {
        await this.cacheManager.del(key);
        
        try
        {
            await this.getCached(key);
            return false
        }
        catch(CachedNotValueException)
        {
            return true
        }
    }
}