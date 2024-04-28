import express from 'express';
import bcrypt from 'bcryptjs'
import restaurantModel from '../models/restaurantModel.js';
import upload from '../middlewares/multerMiddleware.js'


const router = express.Router();

router.post('/restaurant-registration', upload.single('profilePicture'), async (req, res) => {
  try {
    const profilePicture = (req.file) ? req.file.filename : null;
    const { name, email, phoneNumber, ownerName, category, location, latitude, longitude, cuisine, fassaiCode, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // instance after password hashing 
    const restaurant = new restaurantModel({ profilePicture, name, email, phoneNumber, ownerName, category, location, latitude, longitude, cuisine, fassaiCode, password: hashedPassword });

    // user exist or not
    const emailExist = await restaurantModel.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }
    // phone  number is unique or not
    const phoneNumberExist = await restaurantModel.findOne({ phoneNumber });
    if (phoneNumberExist) {
      return res.status(400).json({
        success: false,
        message: "Phone Number Already Exists"
      })
    }
    // fssai  code is unique or not
    const fssaiCodeExist = await restaurantModel.findOne({ fassaiCode });
    if (fssaiCodeExist) {
      return res.status(400).json({
        success: false,
        message: "fassaiCode Already Exists"
      })
    }


    // Save into db
    const savedRestaurant = await restaurant.save()
    console.log("email", email)

    res.status(201).json({

      success: true,
      message: "Restaurant registered successfully",
      data: savedRestaurant
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      res.status(400).json({ errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});


export default router;



/*****************************
http://localhost:3000/api/restaurant-registration

 test route 
{
  "profilePicture": "https://example.com/profile.jpg",
  "name": "Test Restaurant",
  "email": "test@example.com",
  "phoneNumber": "1234567890",
  "ownerName": "John Doe",
  "category": "veg",
  "location": "123 Main St, City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "cuisine": "Italian",
  "fassaiCode": "ABC123DEF456",
  "password": "password123"
}

*/