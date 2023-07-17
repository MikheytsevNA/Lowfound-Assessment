import fp from 'fastify-plugin';
// @ts-ignore
import FireBaseKey from '../lowfound-task-firebase-adminsdk-h96sn-99a6afb279.json' assert { type: "json" };
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const dbPlugin = async (fastify, options) => {
    initializeApp({
        credential: cert(FireBaseKey)
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
