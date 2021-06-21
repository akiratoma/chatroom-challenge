import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || 'secret';

const getAuthenticated = (userInfo: string | undefined) => {
  const token = userInfo ? JSON.parse(userInfo).token : undefined;
  if (token) {
    const decodedToken = jwt.verify(token, SECRET);
    if (typeof decodedToken !== 'string' && !decodedToken.id) {
      return false;
    }
    return true;
  }
  return false;
};

export default getAuthenticated;
