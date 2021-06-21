import { Router } from 'express';
import path from 'path';
import getAuthenticated from '../utils/auth';

const staticRouter = Router();

staticRouter.get('/', (req, res) => {
  const authenticated = getAuthenticated(req.cookies.userInfo);
  if (authenticated) {
    return res.redirect('/lobby');
  }
  return res.redirect('/login');
});

staticRouter.get('/login', (req, res) => {
  const authenticated = getAuthenticated(req.cookies.userInfo);
  if (authenticated) {
    return res.redirect('/lobby');
  }
  return res.sendFile(path.resolve('./public/login.html'));
});

staticRouter.get('/lobby', (req, res) => {
  const authenticated = getAuthenticated(req.cookies.userInfo);
  if (authenticated) {
    return res.sendFile(path.resolve('./public/lobby.html'));
  }
  return res.redirect('/login');
});

staticRouter.get('/chatroom:id', (req, res) => {
  const authenticated = getAuthenticated(req.cookies.userInfo);
  if (authenticated) {
    return res.sendFile(path.resolve('./public/chatroom.html'));
  }
  return res.redirect('/login');
});

export default staticRouter;
