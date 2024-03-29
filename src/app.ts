import express, { Express } from 'express';
import routers from './index'
import bodyParser from 'body-parser';
import { initPassport } from './middlewares/auth.passport'

const app: Express = express();
app.use(express.urlencoded({ extended: false }));

initPassport(app)
app.use(bodyParser.json())
app.use('/api', routers)

export default app;