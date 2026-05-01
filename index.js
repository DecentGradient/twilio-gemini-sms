require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/sms', async (req, res) => {
    const incomingMessage = req.body.Body;
    const fromNumber = req.body.From;

    console.log(`Received message from ${fromNumber}: ${incomingMessage}`);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        
        const prompt = `You are a helpful AI assistant replying to SMS messages. Keep it brief. The user says: ${incomingMessage}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
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
