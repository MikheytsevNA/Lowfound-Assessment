import { Configuration } from 'openai';

const configuration = new Configuration({
  apiKey: 'hmmge'
});

// const openai = new OpenAIApi(configuration);

export async function getChat(messages: string[], model = 'gpt-3.5-turbo', temperature = 0.7) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${configuration.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      temperature: temperature,
      messages: messages
    })
  };
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    return data.choices[0].messages.content;
  } catch (error) {
    console.log(error);
  }
}
