import dotenv from "dotenv"
import fetch from "node-fetch"
dotenv.config()
export const weatherTool = {
    name: "getWeather",
    description: "Get current weather for any city in the world",
    parameters: { //schema for the tool
        type: "object",
        properties: {
            city: {
                type: "string",
                description: "city name like Delhi Moscor London"
            }
        },
        required: ["city"]
    },

    execute: async({city}) =>{
        try {
            const weatherApiKey = process.env.WEATHER_API_KEY
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`)
            const data = await response.json();
            console.log(data)
            if(data?.cod !== 200){
                return  `Weather not found for city ${city}.`
            }

            const temp = data.main.temp;
            const description = data.weather[0].description
            return `Weather in ${city} is ${temp}, ${description}`
        } catch (error) {
            console.log(error)
            return error.message
        }
    }
}