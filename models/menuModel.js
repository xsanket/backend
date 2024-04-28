import mongoose from 'mongoose';


const menuSchema = new mongoose.Schema({

    image: {
        type: String,
        required: true
    },

    dishName: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

})

const menuModel = mongoose.model('menu', menuSchema);

export default menuModel;