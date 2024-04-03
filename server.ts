import dotenv from 'dotenv';
import app from './src/app';
import estabishConnection from './src/config/db';
import mongoose from 'mongoose'

dotenv.config();

const dbUrl = process.env.devDB || "mongodb://localhost:27017/missigEnv";
const port = process.env.PORT || 8000;
estabishConnection(dbUrl)

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/*only for devlopment level  */
if (process.env.NODE_ENV === 'development') {
  app.get('/drop', async (req, res) => {
    console.log('Dropping Database');
    await mongoose.connection.dropDatabase();
    res.send('Done')
  })
}
app.listen(port, () => {
  console.log(`Server is Running at port: ${port}`);
});