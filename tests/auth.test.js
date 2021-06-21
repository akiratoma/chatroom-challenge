import axios from 'axios';
import WebSocket from 'jest-websocket-mock';
import { initializeServer, closeServer } from '../wss';

describe('Authentication tests', () => {
  beforeAll(async () => {
    await initializeServer();
  });

  afterAll(async () => {
    closeServer();
  });

  test('successful login', async () => {
    const { status } = await axios.post('http://localhost:4000/api/login', {
      username: 'user1',
      password: '123456',
    });
    expect(status).toBe(200);
  });

  test('unsuccessful login', async () => {
    try {
      await axios.post('http://localhost:4000/api/login', {
        username: 'user1',
        password: '123457',
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });

  test('an unauthorized user can\'t get the lobby html', async () => {
    try {
      await axios.get('http://localhost:4000/lobby');
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });

  test('an unauthorized user can\'t get the chatroom html', async () => {
    try {
      await axios.get('http://localhost:4000/chatroom1');
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });

  test('an unauthorized user can\'t connect to a chatroom', async () => {
    const client = new WebSocket('ws://localhost:4000');
    client.onclose = () => {
      expect(true);
    };
  });
});
