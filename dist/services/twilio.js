"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioNotificationService = void 0;
const twilio_1 = __importDefault(require("twilio"));
class TwilioNotificationService {
    constructor(accountSid, authToken, fromNumber, toNumber) {
        this.client = (0, twilio_1.default)(accountSid, authToken);
        this.fromNumber = fromNumber;
        this.toNumber = toNumber;
    }
    async send(message) {
        try {
            await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: this.toNumber,
            });
            console.log(`✅ Message sent: ${message}`);
        }
        catch (error) {
            console.error('❌ Failed to send Twilio message:', error);
            throw error;
        }
    }
}
exports.TwilioNotificationService = TwilioNotificationService;
//# sourceMappingURL=twilio.js.map