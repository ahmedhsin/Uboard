import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../middlewares/auth.passport";
const router = Router()

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
},
    passport.authenticate('local', {
        successRedirect: 'api/auth/success',
        failureRedirect: 'api/auth/fail'
    })
);
router.get('/success', (req, res) => {
    res.status(200).json({ message: 'Login success' });
});
router.get ('/fail', (req, res) => {
    res.status(401).json({ message: 'Login fail' });
});
export default router;