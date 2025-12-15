import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMessageDto } from './dto/send-message.dto';
import axios from 'axios';

@Injectable()
export class WhatsappService {
 private readonly apiVersion = 'v24.0';
 private readonly baseUrl: string;
 private readonly token: string;
 private readonly phoneNumberId: string;
 private readonly logger = new Logger(WhatsappService.name)

 constructor(private config: ConfigService) {
  this.token = config.get<string>('WHATSAPP_TOKEN')!;
  this.phoneNumberId = config.get<string>('WHATSAPP_PHONE_NUMBER_ID')!;
  this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}`;
 }

 async sendTextMessage(sendMessageDto: SendMessageDto): Promise<any> {

  try {

   const response = await axios.post(`${this.baseUrl}/messages`,

    {
     messaging_product: 'whatsapp',
     to: sendMessageDto.to,
     type: 'text',
     text: { body: sendMessageDto.message },

    },
    {
     headers: {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
     }
    }
   );
   return response.data;

  } catch (error) {
   this.logger.error("WHatsApp API error", error.response?.data || error.message);
   throw new HttpException("Failed to WhatsApp message", HttpStatus.INTERNAL_SERVER_ERROR);
  }
 }


 async sendTemplateMessage(to: string, templateName: string, languageCode: string = 'en'): Promise<any> {

  try {

   const response = await axios.post(`${this.baseUrl}/messages`,

    {
     messaging_product: 'whatsapp',
     to: to,
     type: 'template',
     template: { name: templateName },
     language: { code: languageCode }
    },
    {
     headers: {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
     }
    }
   );
   return response.data;

  } catch (error) {
   this.logger.error("WhatsApp Template faile", error.response?.data);
   throw new HttpException("failed to send template message", HttpStatus.INTERNAL_SERVER_ERROR);
  }
 }

 async sendMessageAsRead(messageId: string, userPhone: string): Promise<void> {

  try {

   await axios.post(`${this.baseUrl}/messages`,
    {
     messaging_product: 'whatsapp',
     status: 'read',
     message_id: messageId,
     to: userPhone
    },
    {
     headers: {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
     }
    }
   );

  } catch (error) {
   this.logger.error('Mark as read error:', error.response?.data || error.message)
  }
 }

}
