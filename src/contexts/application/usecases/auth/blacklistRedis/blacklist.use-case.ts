import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisBlacklistUseCase {

  // Define a constant for the cache key in Redis
  private readonly BLACKLIST_KEY = 'blacklist_tokens';

  // Inject the cacheService from the NestJS Cache module
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  /**
   * Adds a token to the blacklist.
   *
   * @param token - The token to be added to the blacklist.
   * @param expirationTime - The expiration time for the token in milliseconds.
   *
   * @returns A promise that resolves to void if the token was successfully added to the blacklist, or rejects with a BadRequestException if the token is already blacklisted.
   *
   * @throws BadRequestException - If the token is already blacklisted.
   *
   * @throws InternalServerErrorException - If an error occurs while adding the token to the blacklist.
   * 
   */
  async addToBlacklist(token: string, expirationTime: number): Promise<void> {

    try {

      // Initialize an empty array to store the blacklisted tokens if it doesn't exist in the cache
      let blacklist: string[] =
        (await this.cacheService.get(this.BLACKLIST_KEY)) || [];
      if (blacklist.includes(token)) throw new BadRequestException('Token is already blacklisted');

      // Add the token to the blacklist and save it in the cache
      blacklist.push(token);
      await this.cacheService.set(this.BLACKLIST_KEY, blacklist);

    } catch (error) {

      // Log the error and throw an InternalServerErrorException
      console.error('Failed to add token to blacklist:');
      throw new InternalServerErrorException('Failed to add token to blacklist');

    }
  }

  /**
   * Checks if a token is blacklisted.
   *
   * @param token - The token to be checked.
   *
   * @returns A promise that resolves to a boolean value indicating whether the token is blacklisted, or rejects with a BadRequestException if the token is not provided.
   *
   * @throws BadRequestException - If the token is not provided.
   *
   */
  async isBlacklisted(token: string): Promise<boolean> {

    // Check if the token is blacklisted
    if (!token) throw new BadRequestException('Token is not provided');

    // Initialize an empty array to store the blacklisted tokens if it doesn't exist in the cache
    const blacklist: string[] =
      (await this.cacheService.get(this.BLACKLIST_KEY)) || [];

    // Return true if the token is blacklisted, false otherwise
    return blacklist.includes(token);
  }

  /**
   * Removes a token from the blacklist.
   *
   * @param token - The token to be removed from the blacklist.
   *
   * @returns A promise that resolves to a boolean value indicating whether the token was successfully removed from the blacklist, or rejects with a BadRequestException if the token is not blacklisted.
   *
   * @throws BadRequestException - If the token is not provided.
   *
   * @throws InternalServerErrorException - If an error occurs while removing the token from the blacklist.
   * 
   */
  async removeFromBlacklist(token: string): Promise<boolean> {

    // Check if the token is provided
    if(!token) throw new BadRequestException('Token is not provided');
    
    try {

      // Initialize an empty array to store the blacklisted tokens if it doesn't exist in the cache
      let blacklist: string[] =
        (await this.cacheService.get(this.BLACKLIST_KEY)) || [];

      // Remove the token from the blacklist and save it in the cache
      if (blacklist.includes(token)) blacklist = blacklist.filter((t) => t !== token);

      // Set the updated blacklist in the cache
      const result = await this.cacheService.set(
        this.BLACKLIST_KEY,
        blacklist,
      );

      // Log the result and return true if the token was successfully removed from the blacklist
      return true;

    } catch (error) {

      // Log the error and throw an InternalServerErrorException
      console.error('Failed to remove token from blacklist:');
      console.error(error);
      throw new InternalServerErrorException('Failed to remove token from blacklist');
      
    }
  }
}
