export class SendMessageDto {
 to: string;
 message: string;
}

export class WhatsAppMessageDto {
 object: string;
 entry: Entry[];
}

export class Entry {
 id: string;
 changes: Change[];
}

export class Change {
 value: Value;
 field: string;
}

export class Value {
 messaging_products: string;
 metadata: Metadata;
 messages?: Message[];
}

export class Metadata {
 display_phone_number: string;
 phone_number_id: string;
}

export class Message {
 from: string;
 id: string;
 timestamp: string;
 text: {
  body: string;
 };
 type: string;
}