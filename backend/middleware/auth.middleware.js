import firebase from '../lib/firebaseAdmin.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebase.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log('Error verifying token:', error.message);
    res.status(401).send('Unauthorized');
  }
};

export default authenticate;
