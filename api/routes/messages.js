import fp from 'fastify-plugin';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const loginHook = async function (request, reply) {
    const token = request.session.get('token');
    if (!token) {
        reply.redirect('/login');
        return;
    }
};
const getUserFromAccesToken = async function (accesToken) {
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
const messagePlugin = async (fastify, options) => {
    fastify.get('/login/callback', async function (request, reply) {
        try {
            const token = await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            request.session.set('token', token.token.access_token);
            const user = await getUserFromAccesToken(token.token.access_token);
            const userRef = fastify.db.doc(`users/${user.id}`);
            const userSnapshot = await userRef.get();
            if (!userSnapshot.exists) {
                await userRef.set({ name: user.name });
                console.log('new user is here!');
            }
            reply.redirect('/chat'); // redirect to "/" */
        }
        catch (e) {
            console.error(e);
            reply.send(e);
        }
    });
    fastify.get('/logout', async function (request, reply) {
        // request.session.delete();
        /* reply.clearCookie('oauth2-redirect-state', { path: '/' }); */
        reply.clearCookie('my-session-login-cookie', { path: '/' });
        reply.redirect('/');
    });
    fastify.get('/messages', { preHandler: loginHook }, async (request, reply) => {
        // get messages from db for signed in user
        console.log('/messages');
        const token = request.session.get('token');
        if (!token)
            throw new Error();
        const user = await getUserFromAccesToken(token);
        const userMessagesQuerySnapshot = await fastify.db
            .collection(`/users/${user.id}/messages`)
            .get();
        const userMessages = [];
        userMessagesQuerySnapshot.forEach((value) => userMessages.push({
            ...value.data(),
            id: value.id,
            createDate: value.data().createDate.toDate()
        }));
        reply.send(userMessages);
    });
    fastify.post('/messages', { preHandler: loginHook }, async (request, reply) => {
        // post to openAI API
        // get answer from it
        // save and response
        const question = request.body;
        const token = request.session.get('token');
        if (!token)
            throw new Error();
        const user = await getUserFromAccesToken(token);
        const userMessagesToAPI = [
            {
                role: 'user',
                content: `${question}`
            }
        ];
        const configuration = {
            apiKey: process.env.openAI.toString()
        };
        const openai = new OpenAI(configuration);
        let responseMessage = {
            error: true,
            answer: 'ChatGPT did not answer ;(',
            createDate: new Date(),
            question: question,
            id: ''
        };
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: userMessagesToAPI
            });
            const chatGPTAnswer = completion.choices[0].message?.content;
            // const chatGPTAnswer = '42';
            responseMessage = {
                error: false,
                answer: chatGPTAnswer,
                createDate: new Date(),
                question: question,
                id: ''
            };
        }
        catch { }
        const response = await fastify.db.collection(`/users/${user.id}/messages`).add(responseMessage);
        responseMessage.id = response.id;
        reply.send(responseMessage);
    });
    fastify.delete('/messages/:messageId', { preHandler: loginHook }, async (request, reply) => {
        // delete messege with given id from db
        const { messageId } = request.params;
        const token = request.session.get('token');
        if (!token)
            throw new Error();
        const user = await getUserFromAccesToken(token);
        const deleteTime = fastify.db.collection(`/users/${user.id}/messages`).doc(messageId).delete();
        return deleteTime;
    });
};
export default fp(messagePlugin);
