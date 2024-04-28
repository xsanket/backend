import express from 'express';
import TransactionModel from '../models/transactionModel.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import axios from 'axios';

const router = express.Router();

router.post('/transaction-order', async (req, res) => {
    try {
      const { transactionId, email, name, amount, phone } = req.body;
      const merchantTransactionId = uuidv4();
  
      const data = {
        merchantId: process.env.MERCHANT_ID,
        merchantTransactionId,
        name,
        email : email,
        amount: amount * 100,
        currency: 'INR',
        //redirectUrl: `http://localhost:8000/status?id=${merchantTransactionId}`,
        //redirectMode: 'POST',
        mobileNumber: phone,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };
      console.log("data of transaction =>>>>>>>>>>>>>", data)
  
      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const keyIndex = 1;
      const string = payloadMain + '/pg/v1/pay' + process.env.SALT_KEY;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + keyIndex;
  
      const options = {
        method: 'POST',
        url: process.env.PHONEPE_API_URL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
        data: {
          request: payloadMain,
        },
      };
  
      const response = await axios(options);
  
      if (response.data.success === true) {
        const transaction = new TransactionModel({
          merchantTransactionId,
          merchantId: process.env.MERCHANT_ID,
          name,
          amount,
          status: 'completed',
          email ,
        });
        await transaction.save();
        return res.json(response.data);
      } else {
        
        return res.status(400).json({ error: 'Transaction failed' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error processing the order' });
    }
  });




router.post('/order-status', async (req, res) => {
    const { id: merchantTransactionId } = req.query;
    const merchantId = process.env.MERCHANT_ID;

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    const options = {
        method: 'GET',
        url: `${process.env.PHONEPE_API_URL}/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': merchantId,
        },
    };

    try {
        const response = await axios.request(options);
        const { success, status } = response.data;

        const transaction = await TransactionModel.findOne({ merchantTransactionId });
        transaction.status = success ? 'success' : 'failed';
        await transaction.save();

        if (success) {
            return res.redirect('http://localhost:5173/success');
        } else {
            return res.redirect('http://localhost:5173/fail');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error processing the payment status' });
    }
});

export default router;