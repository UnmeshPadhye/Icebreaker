const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const responses = require('./responses');

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/suggest-response', (req, res) => {
    const context = req.body.context;
    const response = generateResponse(context);
    res.json({ response: response });
});

function generateResponse(context) {
    // Use the GPT API to generate a response based on the conversation context
    // Here's an example using the axios library:
    const prompt = context + ' ';
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    const data = {
        prompt: prompt,
        max_tokens: 1,
        n: 1,
        stop: '\n',
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
    };
    return axios.post(apiUrl, data, { headers: headers })
        .then(response => {
            return response.data.choices[0].text.trim();
        })
        .catch(error => {
            console.log(error);
            return responses[Math.floor(Math.random() * responses.length)];
        });
}

app.listen(3000, () => console.log('Server listening on port 3000.'));
