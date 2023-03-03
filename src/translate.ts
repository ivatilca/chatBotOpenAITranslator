import axios, { AxiosResponse, AxiosRequestHeaders } from "axios";

//SPEECH Serv
let key = process.env.SPEECH_KEY;
let endpoint = process.env.SPEECH_ENDPOINT;
let location = process.env.SPEECH_LOCATION;



export async function translateText(
  textTotranslate: string,
  languageFrom: string,
  languageTo: string
): Promise<string> {
  const { v4: uuidv4 } = require("uuid");
  try {
    const params = new URLSearchParams({
      "api-version": "3.0",
      from: languageFrom,
      to: languageTo,
    });

    const response: AxiosResponse = await axios.post(
      `${endpoint}/translate?${params.toString()}`,
      [
        {
          text: textTotranslate,
        },
      ],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": location,
          "Content-type": "application/json",
          "X-ClientTraceId": uuidv4().toString(),
        },
        responseType: "json",
      }
    );

    if (
      response &&
      response.data &&
      response.data[0].translations &&
      response.data[0].translations[0].text
    ) {
      return response.data[0].translations[0].text;
    } else {
      throw new Error("Unable to translate text");
    }
  } catch (error) {
    throw new Error(`Error translating text: ${error}`);
  }
}
