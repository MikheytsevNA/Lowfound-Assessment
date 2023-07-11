import fp from 'fastify-plugin';
import fs from 'fs';
import path from 'path';
import { FastifyPluginAsync } from 'fastify';
import oauthPlugin from '@fastify/oauth2';
import secureSession from '@fastify/secure-session';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

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
    callbackUri: 'http://localhost:8080/login/callback'
  });
});
