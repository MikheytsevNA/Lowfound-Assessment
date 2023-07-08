import fp from 'fastify-plugin';
import { FastifyPluginAsync, preHandlerAsyncHookHandler } from 'fastify';
export interface Message {
  id: string;
  question: string;
  answer: string;
  createDate: string;
}

const loginHook: preHandlerAsyncHookHandler = async function (request, reply) {
  const token = request.session.get('token');
  if (!token) {
    reply.redirect('/login');
    return;
  }
};

type User = {
  id: number;
  name: string;
};

const getUserFromAccesToken = async function (accesToken: string): Promise<User> {
  const response = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accesToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  const user = await response.json();
  return { id: user.id, name: user.name };
};

const messagePlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/login/callback', async function (request, reply) {
    const token = await this.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    request.session.set('token', token.token.access_token);
    const user = await getUserFromAccesToken(token.token.access_token);
    const userRef = this.db.doc(`users/${user.id}`);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      await userRef.set({ name: user.name });
      console.log('new user is here!');
    }
    reply.redirect('http://localhost:5173'); // redirect to "/"
  });
  fastify.get('/messages', { preHandler: loginHook }, async (request, reply) => {
    // get messages from db for signed in user
    const token = request.session.get('token');
    if (!token) throw new Error();
    const user = await getUserFromAccesToken(token);
    const userMessagesQuerySnapshot = await fastify.db
      .collection(`/users/${user.id}/messages`)
      .get();
    const userMessages: any[] = [];
    userMessagesQuerySnapshot.forEach((value) =>
      userMessages.push({
        ...value.data(),
        id: value.id,
        createDate: value.data().createDate.toDate()
      })
    );
    return userMessages;
  });

  fastify.post('/messages', { preHandler: loginHook }, async (request, reply) => {
    // post to openAI API
    // get answer from it
    // save and response
    return 'pong\n';
  });

  fastify.delete('/messages/:messageId', { preHandler: loginHook }, async (request, reply) => {
    // delete messege with given id from db
    const { messageId } = request.params as any;
    const deleteTime = fastify.db.collection('test').doc(messageId).delete();
    return deleteTime;
  });
};

export default fp(messagePlugin);
