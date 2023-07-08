import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import FireBaseKey from './lowfound-task-firebase-adminsdk-h96sn-99a6afb279.json';
import { initializeApp, applicationDefault, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

const dbPlugin: FastifyPluginAsync = async (fastify, options) => {
  initializeApp({
    credential: cert(FireBaseKey as ServiceAccount)
  });

  const db = getFirestore();

  fastify.decorate('db', db);
};

export default fp(dbPlugin);