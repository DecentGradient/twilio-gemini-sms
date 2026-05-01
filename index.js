require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const twilio = require('twilio');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/sms', async (req, res) => {
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
