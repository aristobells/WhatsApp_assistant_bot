import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';


export type StoredMessage = {
 role: 'user' | 'bot' | 'system';
 text: string;
 timestamp: number;
};

@Injectable()
export class MemoryService implements OnModuleInit, OnModuleDestroy {

 private readonly logger = new Logger(MemoryService.name);
 private client: RedisClientType;
 private readonly convPrefix: "conv";
 private readonly profilePrefix: "profile";
 private readonly ttlSeconds: number;
 private readonly historyLimit: number;

 constructor(
  private readonly config: ConfigService
 ) {
  const url = this.config.get<string>("REDIS_URL");
  console.log(url)
  this.client = createClient({ url });
  this.ttlSeconds = Number(this.config.get<string>('MEMORY_TTL_SECONDS'));
  this.historyLimit = Number(this.config.get<string>("CONV_HISTORY_LIMIT"));
 }
 async onModuleInit() {
  this.client.on('error', (err) => this.logger.error('Redis Client Error', err));
  await this.client.connect();
  this.logger.log('Connected to Redis');
 }
 async onModuleDestroy() {
  await this.client.quit();
  this.logger.log('Redis client disconnected');
 }

 private convKey(userPhone: string) {
  return `${this.convPrefix}${userPhone}`;
 }

 private profileKey(userPhone: string) {
  return `${this.profilePrefix}${userPhone}`;
 }

 /** Append a message to conversation history (LPUSH). Keeps list limited to historyLimit and sets TTL. */
 async appendMessage(userPhone: string, msg: StoredMessage) {
  const key = this.convKey(userPhone);
  await this.client.lPush(key, JSON.stringify(msg));
  await this.client.lTrim(key, 0, this.historyLimit - 1);
  await this.client.expire(key, this.ttlSeconds);
 }

 /** Retrieve last N messages (most recent first). Returns in chronological order (oldest->newest). */
 async getConversation(userPhone: string, limit = this.historyLimit): Promise<StoredMessage[]> {
  const key = this.convKey(userPhone);
  const raw = await this.client.lRange(key, 0, limit - 1); // newest first
  // reverse to oldest->newest
  return raw.reverse().map((s) => JSON.parse(s) as StoredMessage);
 }

 async saveProfile(userPhone: string, profile: Record<string, string>): Promise<void> {
  const key = this.profileKey(userPhone);
  await this.client.hSet(key, profile);
  await this.client.expire(key, this.ttlSeconds);
 }

 async getProfile(userPhone: string): Promise<Record<string, string> | null> {
  const key = this.profileKey(userPhone);
  const res = await this.client.hGetAll(key);
  return Object.keys(res).length ? res : null;
 }

 /** Clear conversation and profile (optional) */
 async clearMemory(userPhone: string): Promise<void> {
  await this.client.del(this.convKey(userPhone));
  await this.client.del(this.profileKey(userPhone));
 }
}
