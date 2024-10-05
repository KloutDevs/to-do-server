import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisBlacklistUseCase {
  private readonly BLACKLIST_KEY = 'blacklist_tokens';
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  async addToBlacklist(token: string, expirationTime: number): Promise<void> {
    try {
      let blacklist: string[] =
        (await this.cacheService.get(this.BLACKLIST_KEY)) || [];
      if (blacklist.includes(token)) {
        throw new BadRequestException('Token is already blacklisted');
      }
      blacklist.push(token);
      await this.cacheService.set(this.BLACKLIST_KEY, blacklist);
    } catch (error) {
      console.error('Failed to add token to blacklist:');
      throw error;
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    if (!token) return false;
    const blacklist: string[] =
      (await this.cacheService.get(this.BLACKLIST_KEY)) || [];
    const isBlacklisted = blacklist.includes(token);
    return isBlacklisted;
  }

  async removeFromBlacklist(token: string): Promise<boolean> {
    if(!token) return false;
    try {
      console.log(`Removing token from blacklist: ${token}`);
      let blacklist: string[] =
        (await this.cacheService.get(this.BLACKLIST_KEY)) || [];
      if (blacklist.includes(token)) {
        blacklist = blacklist.filter((t) => t !== token);
      }
      const result = await this.cacheService.set(
        this.BLACKLIST_KEY,
        blacklist,
      );
      console.log('Remove from blacklist result:', result);
      return true;
    } catch (error) {
      console.error('Failed to remove token from blacklist:', error);
      throw error;
    }
  }
}
