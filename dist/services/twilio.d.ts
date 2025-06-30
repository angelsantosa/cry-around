import { NotificationService } from '../types';
export declare class TwilioNotificationService implements NotificationService {
    private client;
    private fromNumber;
    private toNumber;
    constructor(accountSid: string, authToken: string, fromNumber: string, toNumber: string);
    send(message: string): Promise<void>;
}
//# sourceMappingURL=twilio.d.ts.map