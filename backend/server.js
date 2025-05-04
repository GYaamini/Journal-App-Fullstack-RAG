import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;
const port = process.env.PORT || 5000;
const dbURI = `mongodb+srv://${username}:${password}@cluster0.frtgd0c.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0`

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

//Use router to route to API endpoints
import router from './routes.js';
app.use(router)

//MongoDB Connection
mongoose.connect(dbURI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

//Serve static files
app.use(express.static('dist'));


//Expose Nodejs app tp port 5000 by default
app.listen(port, () => console.log(`Server running on port ${port}`))