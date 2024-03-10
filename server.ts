import dotenv from 'dotenv';
import app from './src/app';
import estabishConnection from './src/config/db';
dotenv.config();

const dbUrl = "mongodb://localhost:27017/uboardv1";
const port = process.env.PORT || 8000;
estabishConnection(dbUrl)

app.listen(port, () => {
  console.log(`Server is Running at port: ${port}`);
});