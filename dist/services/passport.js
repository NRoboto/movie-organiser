"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const models_1 = require("../models");
passport_1.default.use(new passport_local_1.Strategy({ session: false }, async (username, password, done) => {
    try {
        const user = await models_1.User.findOne({ username });
        if (!user)
            return done(null, false, { message: `User "${username}" not found.` });
        if (!user.isPassword(password))
            return done(null, false, { message: `Incorrect password.` });
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async (jwt, done) => {
    try {
        const user = await models_1.User.findById(jwt.sub);
        if (!user)
            return done(null, false, { message: `User not found.` });
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
