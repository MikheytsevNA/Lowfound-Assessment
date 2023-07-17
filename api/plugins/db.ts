import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
// @ts-ignore
import FireBaseKey from '../lowfound-task-firebase-adminsdk-h96sn-99a6afb279.json' assert { type: "json" };
import { initializeApp, applicationDefault, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

const dbPlugin: FastifyPluginAsync = async (fastify, options) => {
  initializeApp({
    credential: cert(FireBaseKey as ServiceAccount)
    /* credential: cert({
      projectId: process.env.projectId,
      clientEmail: process.env.clientEmail,
      privateKey: process.env.privateKey
    } as ServiceAccount) */
  });

  const db = getFirestore();

  fastify.decorate('db', db);
};

export default fp(dbPlugin);
