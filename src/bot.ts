import { ActivityHandler, MessageFactory } from "botbuilder";
import { translateText } from "./translate";
import { postDataToEndpoint } from "./openai";

export class EchoBot extends ActivityHandler {
  constructor() {
    let prompt = `
      As an advanced chatbot, your primary goal is to assist users to the best of your ability. This may involve answering questions, providing helpful information, or completing tasks based on user input. In order to effectively assist users, it is important to be detailed and thorough in your responses. Use examples and evidence to support your points and justify your recommendations or solutions.
  
      <conversation history>
  
      User: <user input>
      Chatbot:
      `;
    const url =
      "https://azureaiservice.openai.azure.com/openai/deployments/chatBot/completions?api-version=2022-12-01";
    let conversation_history = "";
    const headers = {
      "Content-Type": "application/json",
      "api-key": process.env.OPENAI_API_KEY,
    };

    super();
    this.onMessage(async (context, next) => {
      //translate
      const translatedInputText = await translateText(
        context.activity.text,
        "es",
        "en"
      );
      // construct prompt

      let tmp_prompt = prompt
        .replace("<conversation history>", conversation_history)
        .replace("<user input>", translatedInputText);

      // construct request body
      const requestBody = {
        prompt: tmp_prompt,
        max_tokens: 1500,
        temperature: 0.7,
      };

      // send request to openai
      const data = await postDataToEndpoint(url, requestBody, headers);

      // update conversation history
      conversation_history =
        conversation_history +
        "User: " +
        context.activity.text +
        "\nChatbot: " +
        data.choices[0].text +
        "\n";

      // send response to user
      const replyText = `${data.choices[0].text}`;
      //call translate
      const translatedText = await translateText(replyText, "en", "es");
      // const replyText = `Echox: ${ context.activity.text } value: ${ context.activity.value }`;
      await context.sendActivity(MessageFactory.text(translatedText));

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      const welcomeText = await translateText("Hello and welcome!", "en", "es");
      //const welcomeText = await translateText("Hello and welcome!");
      //delete converstaion history

      conversation_history = "";
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(
            MessageFactory.text(welcomeText, welcomeText)
          );
        }
      }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}
