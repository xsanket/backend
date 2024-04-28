import mongoose from 'mongoose';
import validator from 'validator';

const restaurantSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    
  },

  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    min: 10,
    max: 10,
  },

  ownerName: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true,
    enum: ['veg', 'non-veg']
  },
  location: {
    type: String,
    required: true,
  },

  latitude: {
    type: Number,
    required: true,
   
  },
  longitude: {
    type: Number,
    required: true,
    
  },

  cuisine: { 
    type: String, 
    required: true 
  },

  fassaiCode: { 
    type: String, 
    required: true, 
    
  },

  password: { 
    type: String, 
    required: true 
  },

});

const restaurantModel = mongoose.model('Restaurant', restaurantSchema);

export default restaurantModel;