import passport from 'passport';
import JWT from 'jsonwebtoken';
import config from '../config';

export const JWTSign = function (user, date) {
    return JWT.sign({
        iss: config.app.name,
        sub: user.id,
        iat: date.getTime(),
        exp: new Date().setMinutes(date.getMinutes() + 30)
    }, config.app.secret);
}
