import { Injectable } from "@nestjs/common";
import { CachedService } from "./cached.service";
import { nanoid } from "nanoid";

@Injectable()
export class TokenGenerateService {
  constructor(private readonly cacheService: CachedService) {}

  async generateToken(id: number): Promise<string> {
    const token: string = nanoid();

    this.cacheService.setCached(token, id);

    return token;
  }

  async validateToken(token: string): Promise<number>{
    const userId = await this.cacheService.getCached(token);

    await this.cacheService.deleteCached(token);

    return userId;
  }
}
