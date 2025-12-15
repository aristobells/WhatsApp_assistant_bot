import { Body, Controller, Get, Headers, Logger, Post, Query } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ConfigService } from '@nestjs/config';
import { WhatsAppMessageDto } from 'src/whatsapp/dto/send-message.dto';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name)
  constructor(
    private readonly webhookService: WebhookService,
    private readonly config: ConfigService) { }

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: String,
    @Query('hub.challenge') challenge: String,
    @Query('hub.verify_token') verifyToken: string
  ) {
    this.logger.log("Webhook verification attempt");
    const expectedToken = this.config.get<string>('WHATSAPP_VERIFY_TOKEN');
    if (mode === 'subscribe' && verifyToken === expectedToken) {
      this.logger.log("WebHook verified successfully");
      return challenge;
    } else {
      this.logger.log("WebHook verification failed");
      throw new Error("invalid verification token");
    }
  }


  @Post()
  async handleIncomingMessage(
    @Body() body: WhatsAppMessageDto,
    @Headers('x-hub-signature') signature: string
  ) {
    this.logger.log("webhook message recieved");
    try {
      this.webhookService.processMessage(body);
      return { status: "ok" }
    } catch (error) {
      this.logger.error('Error processing webhook message', error);
      throw error
    }
  }

}
