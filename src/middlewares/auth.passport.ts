import passport from "passport";
import e, { Express, Request, Response, NextFunction } from "express";
import * as passportStrategy from "passport-local";
import { getUserById, getUserByUsername, isPasswordEqual } from "../services/user.service";
import IUser from "../interfaces/user.interface";
import { Types } from "mongoose";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import User from "../models/user.model";
dotenv.config();
const dbUrl = process.env.devDB || "mongodb://localhost:27017/missigEnv"; 
const secretKey = process.env.secretKey || "secretKey";

export function initPassport(app: Express) {  
    app.use(session({
        secret: secretKey,
        resave: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        saveUninitialized: false,
        store: new MongoStore({ mongoUrl:  dbUrl})
    }));
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));
    app.use(passport.session());
    passport.use(new passportStrategy.Strategy(
        async (username, password, done) => {
            try {
                if (!username) { done(null, false) }
                const user = await getUserByUsername(username)
                if (!user) { done(null, false) }
                else if (await isPasswordEqual(password, user.password_hash)) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (e) {
                done(e);
            }
        }));
        passport.serializeUser(function(user: any, done) {
            done(null, user._id); 
        });
    
    
        passport.deserializeUser((user_id: Types.ObjectId, done) => {
            try {
                const user = getUserById(user_id);
                done(null, user);
            }catch (e) {
                done(e);
            }
        });

}

export function isAuthenticated(req: Request ,res: Response, next: NextFunction): Response | void {
    if(req.user)
        return next();
    else
        return res.status(401).send("Unauthorized");
}
