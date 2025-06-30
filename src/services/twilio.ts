import twilio from 'twilio';
import { NotificationService } from '../types';

export class TwilioNotificationService implements NotificationService {
  private client: twilio.Twilio;
  private fromNumber: string;
  private toNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string, toNumber: string) {
    this.client = twilio(accountSid, authToken);
    this.fromNumber = fromNumber;
    this.toNumber = toNumber;
  }

  async send(message: string): Promise<void> {
    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.toNumber,
      });
      console.log(`✅ Message sent: ${message}`);
    } catch (error) {
      console.error('❌ Failed to send Twilio message:', error);
      throw error;
    }
  }
} 