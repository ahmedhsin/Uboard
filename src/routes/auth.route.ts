import { Router } from "express";
import passport from "passport";
const router = Router()

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (req.user) {
        return res.status(400).json({ message: 'Already logged in' });
    }
    passport.authenticate('local', (err: any, user: Express.User, info: any) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
  
        return res.status(200).json({
          message: 'Login successful',
        });
      });
    })(req, res, next);
});
router.get('/logout', (req, res, next) => {
    if (!req.user){
        return res.status(400).json({ message: 'Not logged in' });
    }
    req.logout((err) => {
        if (err) {
            next(err)
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});
export default router;