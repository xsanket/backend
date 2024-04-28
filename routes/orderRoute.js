import express from 'express';
import orderModel from '../models/orderModel.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/order', async (req, res) => {
  try {
    console.log('req body :', req.body);
    const order = new orderModel(req.body);
    await order.save();

    // Emit the "new-order" event to all connected clients
    req.app.get('io').emit('new-order', order);

    return res.status(200).send({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.log('error in catch block');
    return res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});




// fetch the orders
router.get('/order', authMiddleware, async (req, res) => {
    try {
      const email = req.query.email; 
      const orders = await orderModel.find({ email });
        
        return res.status(200).send({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        })


    } catch (error) {
        return res.send({
            success: false,
            message: error.message,

        })

    }
});



//to cancel and delete the order entry
router.delete('/order/:orderId', authMiddleware, async (req, res) => {
    try {
      const { orderId } = req.params;
      const deletedOrder = await orderModel.deleteOne({ orderId: orderId });
      if (deletedOrder.deletedCount === 1) {
        return res.status(200).send({
          success: true,
          message: "Order deleted successfully",
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "Order not found",
        });
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });




export default router;


/*
http://localhost:3000/api/order
{
     "orderId": "ORD12345",
     "dishName": "Pizza Margherita",
    "quantity": 1,
     "shippingAddress" : "Pune",
     "totalPrice": 12,
    "email" : "royalhotel@gmail.com"
 }
*/