import OpenAI from "openai";
import readline from "readline";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

class Chatbot {
  constructor() {
    this.conversationHistory = [
      {
        // initialize the conversation
        role: "system",
        content: "You are helpful assistant",
      },
    ];
    this.maxHistoryLength = 10;
  }

  manageHistory() {
    if (this.conversationHistory.length > this.maxHistoryLength) {
      // replace the last block  if exceeds maxHistoryLength
      this.conversationHistory = this.conversationHistory.slice(
        -this.maxHistoryLength
      );
    }
  }

  //call api
  async askAi(userMessage) {
    try {
      const messageBlock = {
        role: "user",
        content: userMessage,
      };
      this.conversationHistory.push(messageBlock);
      this.manageHistory();

      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: this.conversationHistory,
        max_tokens: 30, // max tokens that means X words
        temperature: 0.7, // randomness, lower least random i.e 0
      });

      //get the response and store it
      const aiResponse = response.choices[0].message.content.trim();
      const conversation = {
        role: "assistant",
        content: aiResponse,
      };
      this.conversationHistory.push(conversation);
      return aiResponse;
    } catch (error) {
      console.log(error.message);
    }
  }

  showHistory() {
    const history = this.conversationHistory.map((el, i) => {
      return `${i}. ${el.role} : ${el.content}`;
    });
    console.log(history);
    return;
  }

  clearHistory() {
    this.conversationHistory = [];
    console.log("====History Cleared====");
  }
}

//initilize chat and readline
const bot = new Chatbot();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function startChat() {
  console.log("====WELCOME TO learnAgentic CHATBOT====");
  console.log(" commands : /history /clear /quit");
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++\n");

  const promptUser = () => {
    rl.question("You: ", async (input) => {
      switch (input.toLowerCase()) {
        case "/quit":
          console.log("Shutting Down......");
          rl.close();
          return;

        case "/history":
          bot.showHistory();
          console.log("=========");
          promptUser();
          return;

        case "/clear":
          console.log("clearing......");
          bot.clearHistory();
          promptUser();
          return;

        default:
          if (input.trim()) {
            console.log("Thinking...");
            const response = await bot.askAi(input.trim());
            console.log(`AI: ${response}\n`);
          }
          promptUser();
      }
    });
  };

  promptUser();
}

startChat();
