import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post()
  async generateResponse(@Body("userMessage") userMessage: string) {

    return this.aiService.generateResponse(userMessage)
  }

}
