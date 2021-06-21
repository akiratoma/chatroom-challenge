import WebSocket from 'ws';
import axios from 'axios';
import { Collection } from 'mongodb';
import cookie from 'cookie';
import logger from './utils/logger';
import getAuthenticated from './utils/auth';
import { mongoClient } from './database';

const writeAndBroadcast = async (
  wss: WebSocket.Server,
  messageCollection: Collection<any>,
  user: string,
  post: string,
  chatroom:string,
  timestamp: Date,
) => {
  await messageCollection.insertOne({
    user,
    post,
    chatroom,
    timestamp,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify([{
        user,
        post,
        timestamp,
      }]));
    }
  });
};

const initializeSocket = (wss: WebSocket.Server) => {
  const messageCollection = mongoClient.db('chatroom').collection('messages');
  wss.on('connection', async (ws: WebSocket, req) => {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : undefined;
    const userInfo = cookies ? cookies.userInfo : undefined;
    const authenticated = getAuthenticated(userInfo);
    if (authenticated) {
      const [user, chatroom] = ws.protocol.split('-');
      logger.info(`${user} connected in chatroom${chatroom}!`);
      const messages = await messageCollection
        .find({ chatroom })
        .sort({ timestamp: -1 })
        .project({ _id: 0, chatroom: 0 })
        .limit(50)
        .toArray();
      ws.send(JSON.stringify(messages.reverse()));
      ws.on('message', async (post: string) => {
        const timestamp = new Date();
        if (/\/stock=(.)*/.test(post)) {
          const ticker = post.split('=')[1];
          const { data } = await axios.get(`https://stooq.com/q/l/?s=${ticker}&f=sd2t2ohlcv&h&e=csv`);
          if (data === 'Ticker missing') {
            ws.send(JSON.stringify([{
              user,
              post: 'Error: Ticker is missing',
              timestamp,
            }]));
          } else {
            const price = data.split('\n')[1].split(',')[3];
            if (price === 'N/D') {
              ws.send(JSON.stringify([{
                user,
                post: 'Error: Ticker doesn\'t exist',
                timestamp,
              }]));
            } else {
              writeAndBroadcast(wss, messageCollection, user, `${ticker.toUpperCase()} quote is $${price} per share`, chatroom, timestamp);
            }
          }
        } else {
          writeAndBroadcast(wss, messageCollection, user, post, chatroom, timestamp);
        }
      });
    } else {
      ws.close();
    }
  });
};

export default initializeSocket;
