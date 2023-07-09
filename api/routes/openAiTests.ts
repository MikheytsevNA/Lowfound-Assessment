import { Configuration, ChatCompletionResponseMessage, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: 'nope'
});

export async function getChat(messages: string[], model = 'gpt-3.5-turbo', temperature = 0.7) {
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello world' }
    ]
  });
  // const data = await completion.data.choices[0].message;
  console.log(JSON.stringify(completion.data.choices[0].message?.content));
  return JSON.stringify(completion.data);
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
    const data = (await response.json()) as ChatCompletionResponseMessage;
    console.log(data.content);
    // return data;
  } catch (error) {
    console.log(error);
  }
}
