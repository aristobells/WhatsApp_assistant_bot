import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AiModule } from './ai/ai.module';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';
import { MemoryModule } from './memory/memory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    WhatsappModule,
    AiModule,
    WebhookModule,
    MemoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
