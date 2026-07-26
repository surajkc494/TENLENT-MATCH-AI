import { GoogleGenAI } from '@google/genai';
const client = new GoogleGenAI({ apiKey: 'x' });
console.log('chats methods', Object.getOwnPropertyNames(Object.getPrototypeOf(client.chats)).sort());
console.log('interactions methods', Object.getOwnPropertyNames(Object.getPrototypeOf(client.interactions)).sort());
console.log('chats.create signature', Object.getPrototypeOf(client.chats).create.toString().slice(0,1200));
console.log('interactions.create signature', Object.getPrototypeOf(client.interactions).create.toString().slice(0,1200));
