const jwt = require('jsonwebtoken');
/*
Did have a isMember middleware but since there were no "only member, no admin" routes, I removed it as the authMiddleware did the "logged in user check"
*/

const authMiddleware = (req, res, next) => {
  let token = req.cookies.jwt;

  // If no cookie, check for the bearer token in the headers
  if (!token) {
    const noCookie = req.headers.authorization;
    if (noCookie && noCookie.startsWith('Bearer ')) {
      token = noCookie.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(403).json({ message: 'No token was found' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Wrong JWT token' });
  }
};

const adminOnly = (req, res, next) => {
  // Default admin role, maybe abit primitive if database changes
  const roleId = 1;
  if (req.user && req.user.roleId === roleId) {
    next();
  } else {
    res.status(403).json({ message: 'No access, only for admin users' });
  }
};

module.exports = { authMiddleware , adminOnly };