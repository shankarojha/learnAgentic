import { client } from "../utils/client.js";
import { tools, toolMap } from "../tools/toolRegistry.js";

export class Agent {
  constructor() {
    this.messages = [
      {
        role: "system",
        content: "You are an AI agent that can use tools when needed",
      },
    ];
  }

  async run(userInput) {
    this.messages.push({
      role: "user",
      content: userInput,
    });

    while (true) {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: this.messages,
        tools: tools.map((tool) => ({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        })),
      });

      const message = response.choices[0].message

      if(!message.tool_calls){
        return message.content;
      }

      const toolCall = message.tool_calls[0];
      const toolName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      const tool = toolMap[toolName]
      const result = await tool.execute(args);
      this.messages.push(message);
      this.messages.push({
        role:"tool",
        tool_call_id : toolCall.id,
        content: result
      })
    }
  }
}
