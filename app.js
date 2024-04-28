import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConfig from './config/dbConfig.js';
import restRegistration from './routes/restRegRoute.js';
import restLogin from './routes/restLoginRoute.js';
import restProfile from './routes/restProfile.js';
import orderRouter from './routes/orderRoute.js';
import menuRoute from './routes/menuRoute.js';
import transactionRoute from './routes/transactionRoute.js'
import completedOrders from './routes/completedOrders.js'
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: ['content-type'],
  },
});

// Attach the Socket.IO instance to the Express app
app.set('io', io);

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
dbConfig.dbConnection();

app.use('/uploads', express.static('uploads'));
app.use('/menuUploads', express.static('menuUploads'));

// Routes
app.use('/api', restRegistration);
app.use('/api', restLogin);
app.use('/api', restProfile);
app.use('/api', orderRouter);
app.use('/api', menuRoute);
app.use('/api', transactionRoute); 
app.use('/api', completedOrders);






io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});