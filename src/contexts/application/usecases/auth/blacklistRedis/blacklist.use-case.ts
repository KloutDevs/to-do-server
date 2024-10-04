import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisBlacklistUseCase {
  private readonly BLACKLIST_KEY = 'blacklist_tokens';
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  async addToBlacklist(token: string, expirationTime: number): Promise<void> {
    try {
      console.log(`Adding token to blacklist: ${token}`);
      let blacklist: string[] =
        (await this.cacheService.get(this.BLACKLIST_KEY)) || [];
      const test = await this.cacheService.get(this.BLACKLIST_KEY);
      console.log('Test:', test);
      console.log('Current blacklist:', blacklist);
      if (!blacklist.includes(token)) {
        console.log('Is not in blacklist, adding!');
        blacklist.push(token);
        console.log('Blacklist after push token')
        console.log(blacklist)
      }
      await this.cacheService.set('test_key', 'test_value');
      const aaa = await this.cacheService.get('test_key');
      console.log('Test after set:', aaa);
      await this.cacheService.set(this.BLACKLIST_KEY, blacklist);
      const bbb = await this.cacheService.get(this.BLACKLIST_KEY);
      console.log('Blacklist after set:', bbb);
    } catch (error) {
      console.error('Failed to add token to blacklist:', error);
      throw error;
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    console.log(`Checking blacklist for token ${token}`);
    if (!token) return false;
    const blacklist: string[] =
      (await this.cacheService.get(this.BLACKLIST_KEY)) || [];
    const isBlacklisted = blacklist.includes(token);
    console.log('Is blacklisted result:', isBlacklisted);
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
