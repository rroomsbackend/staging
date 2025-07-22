import JWT from 'jsonwebtoken';
const config = process.env;
export const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = JWT.verify(token, config.APP_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
}

export const loginCheck = () => {
  return (req, res, next) => {
    var token = null;
    if (req && req.cookies) {
      //console.log("-------------",req.cookies['XSRF-token']);
      token = req.cookies['XSRF-token'];
    }
    if (!token) {
      return res.status(200).json({ status: false, msg: "A token is required for authentication" });
    }
    next();
  }
}

export const userImplant = (req, res, next) => {
  res.locals.user = req.user;
  next();
}