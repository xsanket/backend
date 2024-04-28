import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js'
import menuUpload from '../middlewares/menuMulterMiddleware.js';
import menuModel from '../models/menuModel.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

//save menu in db
router.post('/menu', menuUpload.single('image'), async (req, res) => {
    try {
        const image = req.file.filename;
        console.log('req.body:', req.body);
        const { dishName, description, price, email } = req.body;

        const menu = new menuModel({
            image,
            dishName,
            description,
            price,
            email,
        });

        const savedMenu = await menu.save();

        res.send({
            message: 'Menu saved successfully',
            data: savedMenu
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});



router.get('/get-menu', async (req, res) => {
  try {
      const email = req.query.email;
      if (!email) {
          return res.status(400).send({
              message: 'Email parameter is required.',
          });
      }

      const menus = await menuModel.find({ email });

      res.send({
          message: 'Menus fetched successfully',
          data: menus,
      });
  } catch (error) {
      return res.status(500).send({
          message: error.message,
      });
  }
});




router.delete('/delete-menu/:_id', async (req, res) => {
    try {
      const { _id } = req.params;
      let objectId;

      if (ObjectId.isValid(_id)) {
        objectId = new ObjectId(_id);
      } else {
        return res.status(400).send({
          success: false,
          message: 'Invalid ID format',
        });
      }
  
      const deleteMenu = await menuModel.deleteOne({ _id: objectId });
  
      if (deleteMenu.deletedCount === 1) {
        return res.status(200).send({
          success: true,
          message: 'Menu deleted successfully',
          data: deleteMenu,
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'Failed to delete menu',
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  });




export default router;