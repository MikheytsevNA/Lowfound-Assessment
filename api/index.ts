import fastify from 'fastify';
import messagesRoutes from './routes/messages.js';
import dbPlugin from './plugins/db.js';
import oauth2Plugin from './plugins/oauth2.js';
import cors from '@fastify/cors';
import FastifyVite from "@fastify/vite";
import { OAuth2Namespace } from '@fastify/oauth2';
import { Session, SessionData } from '@fastify/secure-session';
import path from 'path';
import { request } from 'http';

declare module '@fastify/secure-session' {
  interface SessionData {
    token: string;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    db: FirebaseFirestore.Firestore;
    githubOAuth2: OAuth2Namespace;
    vite: any;
  }
  interface FastifyRequest {
    session: Session<SessionData>;
  }
  interface FastifyReply {
    html: Function;
  }
}

const server = fastify({ logger: false });

await server.register(FastifyVite, {
  root: import.meta.url,
  dev: process.argv.includes('--dev'),
  spa: true
})

await server.vite.ready();

server.get("/", (req, reply) => {
  reply.html();
});

server.setNotFoundHandler((request, reply) => {
  reply.html();
})

await server.register(cors, {
  origin: 'https://test-6nvp.onrender.com',
  methods: ['GET', 'DELETE', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
});

/* server.register(import('@fastify/static'), {
  root: path.join(__dirname, '../frontend-dist'),
  serve: false
}); */
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
