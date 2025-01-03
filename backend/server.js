require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const https = require("https");
const app = express();
// const { Groq } = require('groq-sdk');
const PORT = process.env.PORT || 4000;
// const splitText = require("./utils/splitText");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/summarize", async (req, res) => {
  const { group } = req.body;

  // if(!group.length){
  //   res.status(400).send({ message: "sentence not found", data: { group, summary: "Error summarizing sentence" } });
  // }

  try {
    // throw new Error("")
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: `Summarize the essential details of this article in a one sentence. Do not include extra text` },
          { role: "user", content: group },
        ],
        temperature: 0,
        // max_tokens: 1024,
        top_p: 1,
        // stream: false,
        stop: null,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );

    // console.log("response.data.choices[0].message.content",response.data.choices[0].message.content);
    res.status(200).send({ message: "Summary generated", data: { group, summary: response.data.choices[0].message.content } });

    // return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Error summarizing sentence:", err);
    res.status(400).send({ message: "Error summarizing sentence", data: { group, summary: "Error summarizing sentence" } });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
