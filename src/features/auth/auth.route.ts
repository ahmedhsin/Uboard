import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "./auth.passport";
const router = Router()

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/auth/login-success',
        failureRedirect: '/auth/login-failure'
    })(req, res, next);
});
  
router.get('auth/login-failure', (req, res, next) => {
res.send('Login Attempt Failed.');
});

router.get('/login-success',isAuthenticated, (req, res, next) => {
res.send('Login Attempt was successful.');
});
export default router;