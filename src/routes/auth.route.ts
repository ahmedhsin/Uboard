import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../middlewares/auth.passport";
const router = Router()

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
    
        if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
    
          // Send success response with relevant code data in JSON format
          return res.status(200).json({
            message: 'Login successful',
          });
        })(req, res, next);
});
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err)
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});
export default router;