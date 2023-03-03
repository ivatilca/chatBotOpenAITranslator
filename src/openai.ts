import axios, { AxiosResponse, AxiosRequestHeaders } from "axios";
import { translateText } from "./translate";

interface RequestBody {
  prompt: string;
  max_tokens: number;
  temperature: number;
}

interface OpenAiResponse {
  choices: [
    {
      text: string;
    }
  ];
  usage: {
    total_tokens: number;
  };
}

export async function postDataToEndpoint(
  url: string,
  requestBody: RequestBody,
  headers: AxiosRequestHeaders
): Promise<OpenAiResponse> {
  try {
    const response: AxiosResponse = await axios.post(url, requestBody, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data to ${url}: ${error}`);
  }
}
