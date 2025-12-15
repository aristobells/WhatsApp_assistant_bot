import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { AiModule } from 'src/ai/ai.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { MemoryModule } from 'src/memory/memory.module';

@Module({
  imports: [AiModule, WhatsappModule, MemoryModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule { }
