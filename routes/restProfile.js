import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js'
import restaurantModel from '../models/restaurantModel.js';



const router = express.Router();

// Get restaurant
router.get('/get-restaurant', authMiddleware, async (req, res) => {
  try {
    const user = await restaurantModel.findOne({ _id: req.body.userId });

    return res.send({
      success: true,
      message: "Restaurant retrieved successfully",
      data: user,
    });

  } catch (error) {
    return res.send({
      success: false,
      message: "cannot retrieve the restaurant"
    });

  }

});


export default router;