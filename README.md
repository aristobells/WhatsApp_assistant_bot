# WhatsApp Assistant Bot

A production-style WhatsApp chatbot built with NestJS that processes real webhook events, integrates external APIs, and generates automated responses using an AI provider.

This project focuses on backend architecture, API integration, and event-driven design, not just chatbot replies.


# Why this project exists

Many chatbots stop at demos. This project simulates how a real WhatsApp assistant would work in production:
- Handling inbound webhook traffic
- Validating and processing messages
- Integrating third-party services securely
- Structuring logic for future growth
- It’s designed to reflect how backend systems behave in real business environments.

# What this project demonstrates
- Designing and handling Webhook-based APIs
- Integrating WhatsApp Cloud API and external AI services
- Backend architecture using NestJS modules, controllers, and services
- Clean separation of concerns and extensible message handling
- Secure configuration using environment variables
- Writing maintainable, production-oriented TypeScript code


## 🛠️ Prerequisites

Before running the project, make sure you have:

- Node.js **>= 18**
- NestJS
- npm or yarn
- A WhatsApp Business Account with **Cloud API access**
- API keys for your AI provider (e.g., OpenAI API key)


# High-Level System Flow
- WhatsApp sends a webhook event when a user sends a message
- NestJS controller receives and validates the payload
- Message data is processed by a service layer
- AI service generates a contextual response
- Bot sends a reply back through the WhatsApp Cloud API

# Project Structure (Simplified)
src/
├── whatsapp/
│   ├── whatsapp.controller.ts
│   ├── whatsapp.service.ts
│   └── whatsapp.module.ts
├── ai/
│   ├── ai.controller.ts
│   ├── ai.service.ts
│   └── ai.module.ts
├── webhook/
│   ├── webhook.controller.ts
│   ├── webhook.service.ts
│   └── webhook.module.ts
├── memory/
│   ├── memory.controller.ts
│   ├── memory.service.ts
│   └── memory.module.ts
├── app.module.ts
└── main.ts


## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aristobells/WhatsApp_assistant_bot.git
   cd WhatsApp_assistant_bot

# Install dependencies:
npm install

# Webhook Setup (Overview)
- Expose your local server using a tunneling tool (e.g., ngrok)
- Register the webhook URL in the Meta Developer Console
- Subscribe to WhatsApp message events
- Verify the webhook


# Future Improvements
- Media and voice message handling
- Rate limiting and retry logic
- Authentication and request signature verification
- Deployment pipelines (Docker / CI)

