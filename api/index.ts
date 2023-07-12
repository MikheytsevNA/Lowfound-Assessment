import fastify from 'fastify';
import messagesRoutes from './routes/messages';
import dbPlugin from './plugins/db';
import oauth2Plugin from './plugins/oauth2';
import cors from '@fastify/cors';
import { OAuth2Namespace } from '@fastify/oauth2';
import { Session, SessionData } from '@fastify/secure-session';
import path from 'path';

declare module '@fastify/secure-session' {
  interface SessionData {
    token: string;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    db: FirebaseFirestore.Firestore;
    githubOAuth2: OAuth2Namespace;
  }
  interface FastifyRequest {
    session: Session<SessionData>;
  }
}

const server = fastify({ logger: true });
const applyCors = async () => {
  await server.register(cors, {
    origin: 'https://test-6nvp.onrender.com',
    methods: ['GET', 'DELETE', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  });
};

applyCors();

server.register(import('@fastify/static'), {
  root: path.join(__dirname, '../frontend-dist'),
  serve: false
});
server.register(dbPlugin);
server.register(oauth2Plugin);

server.register(messagesRoutes);

server.get('*', async (request, reply) => {
  reply.sendFile('*/index.html');
  return reply;
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
