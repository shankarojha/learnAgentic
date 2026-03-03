import aiService from "../services/ai.service.js";

const askAi = async (req, res) => {
  try {
    const reqPrompt = req.body.prompt;
    if(!reqPrompt){
        res.json({"error":"prompt missing"})
    }
    const defaultSystemContent = "You are a helpful assistant.";
    const prompt = [
      {
        role: "system",
        content: defaultSystemContent,
      },
      {
        role: "user",
        content: reqPrompt,
      },
    ];

    const response = await aiService.askAi(prompt);
    console.log(response);
    res.status(200).send(response[0].message.content);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export default {
  askAi,
};
