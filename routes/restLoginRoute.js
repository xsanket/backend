import express from 'express';
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
import restaurantModel from '../models/restaurantModel.js';
import jwt from 'jsonwebtoken';

const  router = express.Router();
dotenv.config();


router.post('/restaurant-login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check for email and password
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      // Check if the user exists in the db
      const user = await restaurantModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // password match
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // if password valid gen a jwt token
      const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, { expiresIn: '1d' });
  
      // Send the token in the response
      res.status(200).json({ success: true, token });
  
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  export default  router;
  