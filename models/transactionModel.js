import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  merchantTransactionId: {
    type: String,
    required: true,
    unique: true,
  },
  merchantId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

export default TransactionModel;