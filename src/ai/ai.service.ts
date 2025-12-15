import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
 private readonly logger = new Logger(AiService.name);
 private readonly groq: Groq
 constructor(
  private config: ConfigService
 ) {
  this.groq = new Groq({ apiKey: config.get<string>('GROQ_API_KEY') })
 }

 async generateResponse(userMessage: string) {
  try {

   const chatCompletion = await this.groq.chat.completions.create({
    messages: [
     {
      role: "system",
      content: `You are a helpful WhatsApp assistant.Be:
              - Concise(under 300 characters)
              - Friendly and conversational
              - Helpful and accurate
              - Use emojis occasionally
              - Never mention you're an AI unless asked`,
     },
     {
      role: "user",
      content: userMessage,
     },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 0.5

    // max_completion_tokens: 260

   });

   return chatCompletion?.choices?.[0]?.message?.content || '';

  } catch (error) {
   this.logger.error("Groq Request failed", error);
   throw new BadRequestException("Groq Request failed")
  }
 }

}
