import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User  from '../models/user';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!
};

export default new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id);
    return user ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error, false);
  }
});