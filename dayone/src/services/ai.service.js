import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
});

const askAi = async(prompt)=>{
    console.log("key",process.env.OPEN_API_KEY)
    const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: prompt 
    })

    return response.choices
}

export default {
    askAi
}
