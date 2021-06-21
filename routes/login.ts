import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { mongoClient } from '../database';

const loginRouter = Router();
const SECRET = process.env.SECRET || 'secret';

loginRouter.post('/', async (req, res) => {
  const userCollection = mongoClient.db('chatroom').collection('users');
  const { username, password } = req.body;
  const user = await userCollection.findOne({ username });
  const match = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && match)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  };

  const token = jwt.sign(userForToken, SECRET);
  return res.status(200).send({
    token,
    username: user.username,
    rooms: user.rooms,
  });
});

export default loginRouter;
