import { Injectable, Logger } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { MemoryService } from 'src/memory/memory.service';
import { WhatsAppMessageDto } from 'src/whatsapp/dto/send-message.dto';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
export class WebhookService {
 private readonly logger = new Logger(WebhookService.name);
 constructor(
  private readonly whatsAppService: WhatsappService,
  private readonly aiService: AiService,
  private readonly memoryService: MemoryService
 ) { }

 async processMessage(body: WhatsAppMessageDto) {

  try {
   if (!body.entry || body.entry.length === 0) {
    return;
   }
   for (const entry of body.entry) {
    for (const change of entry.changes) {
     if (change.value.messages && change.value.messages.length > 0) {
      for (const message of change.value.messages) {
       await this.handleMessage(message);
      }
     }
    }
   }
  } catch (error) {
   this.logger.error('Error in processMessage:', error);
  }

 }



 private async handleMessage(message: any) {

  if (message) {

   const userPhone = message.from
   const messageId = message.id
   await this.whatsAppService.sendMessageAsRead(messageId, userPhone)
  }

  if (message.type !== 'text') {
   await this.whatsAppService.sendTextMessage({
    to: message.from,
    message: 'I can only process text messages at the moment'
   });
   return;
  }

  const userMessage = message.text.body;
  this.logger.log(`Received message from ${message.from}: ${userMessage}`);

  try {
   // fetch previous memory
   const previousMemory = await this.memoryService.getConversation(message.from);

   const aiInput = previousMemory ? `Previous message: ${previousMemory}\nUser: ${userMessage}` : userMessage
   // generate ai response
   const aiResponse = await this.aiService.generateResponse(aiInput);

   //  send ai response to whatsapp user

   await this.whatsAppService.sendTextMessage({
    to: message.from,
    message: aiResponse
   });
   this.logger.log(`Sent AI response to ${message.from}`);

   await this.memoryService.appendMessage(message.from, userMessage)

  } catch (error) {
   this.logger.error('Error generating AI response:', error);
   await this.whatsAppService.sendTextMessage({
    to: message.from,
    message: 'Sorry, I encountered an error processing your message. Please try again'
   });
  }
 }

}
