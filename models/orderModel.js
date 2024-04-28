import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },

    dishName: {
        type: String,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    shippingAddress: {
        type: String,
        required: true,
    },

    totalPrice: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }


);

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel;