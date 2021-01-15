import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User, TokenObject } from "../models";

passport.use(
  new LocalStrategy({ session: false }, async (username, password, done) => {
    try {
      const user = await User.findOne({
        username: username.toLowerCase(),
      }).select("+password +tokens");

      if (!user)
        return done(null, false, { message: "Invalid username or password" });

      if (!(await user.isPassword(password)))
        return done(null, false, { message: "Invalid username or password" });

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
    async (jwt: TokenObject, done) => {
      try {
        const user = await User.getByJwt(jwt);

        if (!user) return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
