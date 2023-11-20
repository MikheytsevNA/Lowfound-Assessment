import fp from 'fastify-plugin';
import fs from 'fs';
import path, { dirname } from 'path';
import { FastifyPluginAsync } from 'fastify';
import oauthPlugin from '@fastify/oauth2';
import secureSession from '@fastify/secure-session';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config();

const __dirname = fileURLToPath(dirname(import.meta.url));

export default fp(async function (fastify, options) {
  fastify.register(secureSession, {
    sessionName: 'session',
    cookieName: 'my-session-login-cookie',
    key: fs.readFileSync(path.join(__dirname, '../secret-key')),
    cookie: {
      path: '/'
    }
  });
  fastify.register(oauthPlugin, {
    name: 'githubOAuth2',
    scope: [],
    credentials: {
      client: {
        id: process.env.githubId!.toString(),
        secret: process.env.githubSecret!.toString()
      },
      auth: oauthPlugin.GITHUB_CONFIGURATION
    },
    startRedirectPath: '/login',
    callbackUri: `${
      'RENDER' in process.env ? `https://test-6nvp.onrender.com` : `http://127.0.0.1:3001`
    }/login/callback` // change for render.com deply!!!
  });
});
