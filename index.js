import OpenAI from "openai"
import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import path from "path"
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
    apiKey: process.env.MY_OPENAI_KEY,
});

const app = express();
const PORT = 3001;

app.use(bodyParser.json())
app.use(cors())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/', async (req, res) => {
  try {
    const { messages, model } = req.body;

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: model,
    });
    
    res.json({ response: completion.choices[0].message.content });
    console.log(completion.choices[0].message.content);
} catch (error) {
    console.error('Errore nel backend:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

app.listen(PORT, () => {
    console.log("App running on localhost, port", PORT);
})
