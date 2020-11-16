import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models";

passport.use(
  new LocalStrategy({ session: false }, async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user)
        return done(null, false, { message: `User "${username}" not found.` });

      if (!user.isPassword(password))
        return done(null, false, { message: `Incorrect password.` });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwt, done) => {
      try {
        const user = await User.findById(jwt.sub);

        if (!user) return done(null, false, { message: `User not found.` });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
