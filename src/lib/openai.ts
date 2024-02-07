import 'dotenv/config'
import { OpenAI } from "openai";

// integrando com a openai
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
})
