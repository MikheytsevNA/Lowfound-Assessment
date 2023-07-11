import fastify from 'fastify';
import messagesRoutes from './routes/messages';
import dbPlugin from './plugins/db';
import oauth2Plugin from './plugins/oauth2';
import cors from '@fastify/cors';
import { OAuth2Namespace } from '@fastify/oauth2';
import { Session, SessionData } from '@fastify/secure-session';

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

const server = fastify();
const applyCors = async () => {
  await server.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'DELETE', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  });
};

applyCors();
server.register(dbPlugin);
server.register(oauth2Plugin);

server.register(messagesRoutes);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
