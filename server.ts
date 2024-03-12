import dotenv from 'dotenv';
import app from './src/app';
import estabishConnection from './src/config/db';

dotenv.config();

const dbUrl = process.env.devDB || "mongodb://localhost:27017/missigEnv";
const port = process.env.PORT || 8000;
estabishConnection(dbUrl)

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is Running at port: ${port}`);
});