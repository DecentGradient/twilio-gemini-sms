require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const twilio = require('twilio');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Standardize request payload handling to strictly expect application/json over older form-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Setup Twilio webhook validation middleware to authenticate inbound requests
// This securely confirms that incoming requests genuinely originated from Twilio
// Ensure process.env.TWILIO_AUTH_TOKEN is set in the environment
app.post('/api/sms', twilio.webhook({ validate: true }), async (req, res) => {
    const incomingMessage = req.body.Body;
    const fromNumber = req.body.From;

    console.log(`Received message from ${fromNumber}: ${incomingMessage}`);

    try {
        const prompt = `You are a helpful AI assistant replying to SMS messages. Keep it brief. The user says: ${incomingMessage}`;
        const result = await ai.models.generateContent({
            model: "gemini-3.1-pro",
            contents: prompt
        });
        const responseText = result.text;
        
        const twiml = new twilio.twiml.MessagingResponse();
        twiml.message(responseText);
        
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
        
    } catch (error) {
        console.error('Error processing message:', error);
        const twiml = new twilio.twiml.MessagingResponse();
        twiml.message("Sorry, I encountered an error processing your message.");
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
