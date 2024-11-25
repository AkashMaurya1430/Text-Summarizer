require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const https = require("https");
const app = express();
// const { Groq } = require('groq-sdk');
const PORT = process.env.PORT || 4000;
const splitText = require("./utils/splitText");

app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
  res.send("Server is running")
})

app.post("/summarize", async (req, res) => {
  const { text, x } = req.body;

  // Split text into sentences
  const sentences = splitText(text, x);

  if(sentences.length < 1){
    return res.status(400).send({ message: "No sentences found" });
  }

  // Summarize each sentence
  const summaries = await Promise.all(
    sentences.map(async (sentence) => {

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama3-8b-8192',
            messages: [
                { role: 'system', content: `Summarize the essential details of this article in a one sentence. Do not include extra text` },
                { role: 'user', content: sentence }
            ],
            temperature: 1,
            // max_tokens: 1024,
            top_p: 1,
            // stream: false,
            stop: null
        }, {
            headers: {
                'Authorization': `Bearer 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`
            }, httpsAgent: new https.Agent({
                rejectUnauthorized: false,
              }),
        });
    
        // console.log("response.data.choices[0].message.content",response.data.choices[0].message.content);
        return response.data.choices[0].message.content
    } catch (err) {
        console.error('Error summarizing sentence:', err);

        return sentence; // Return the original sentence in case of an error
    }
    })
  );

  res.status(200).send({ message: "No sentences found",data:{ sentences, summaries } });

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
