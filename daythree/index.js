import readline from "readline";
import { Agent } from "./agents/agent.js";

const agent = new Agent();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask() {

  rl.question("You: ", async (input) => {

    const response = await agent.run(input);

    console.log("Agent:", response);

    ask();
  });
}

ask();