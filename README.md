# Twilio SMS Integration with Gemini 3.1 Pro

This project is a webhook integration that leverages the Gemini model to generate intelligent SMS responses via Twilio.

## Setup

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in your keys.
4. Run `npm start`.

## Integration

Point your Twilio phone number's webhook for incoming messages to your server's `/api/sms` endpoint.

## Testing
Successfully tested receiving a message ("Final Test SMS - Gemini 3.1 Pro") from Twilio Number +18482929234 and integration was fully verified.
