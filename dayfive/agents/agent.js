import { client } from "../utils/client.js";
import { tools, toolMap } from "../tools/toolRegistry.js";
import { setMemory, getMemory } from "../utils/memory.js";

export class Agent {
  constructor() {
    this.systemPrompt = {
      role: "system",
      content: "You are an AI agent that can use tools when needed",
    };
  }

  async run(userId, userInput) {

    let history = await getMemory(userId);

    if (history.length === 0) {
      history.push(this.systemPrompt);
    }

    history.push({
      role: "user",
      content: userInput,
    });

    await setMemory(userId, history);
    let context = history
    while (true) {
      if(history.length>10){
        context = [this.systemPrompt, ...history.slice(-10)];
    }
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: context,
        tools: tools.map((tool) => ({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        })),
      });

      const message = response.choices[0].message;

      if (!message.tool_calls) {

        history.push(message);
        await setMemory(userId, history);

        return message.content;
      }

      const toolCall = message.tool_calls[0];
      const toolName = toolCall.function.name;

      const args = JSON.parse(toolCall.function.arguments);

      const tool = toolMap[toolName];

      const result = await tool.execute(args);

      history.push(message);

      history.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });

      await setMemory(userId, history);
      console.log("history", await getMemory(userId))
    }
  }
}