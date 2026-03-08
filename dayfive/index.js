import readline from "readline";
import { Agent } from "./agents/agent.js";

const userId = "shankar234";
const agent = new Agent(userId);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function chat() {
  try {
    rl.question("You: ", async (message) => {
    const reply = await agent.run(userId, message);
    console.log("Agent: ", reply);
    chat();
  });
  } catch (error) {
    console.log(error)
  }
}

chat();
