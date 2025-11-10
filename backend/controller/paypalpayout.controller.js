// controller/payout.controller.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  PAYPAL_API_BASE,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
} from '../config/env.js';

/* -------------------------------------------------------------------------- */
/* Helper function — generate a short-lived access token                      */
/* -------------------------------------------------------------------------- */
async function generateAccessToken() {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString('base64');

  const response = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  return response.data.access_token;
}

/* -------------------------------------------------------------------------- */
/* Send Payout to Seller                                                      */
/* -------------------------------------------------------------------------- */
export const sendPayoutToSeller = async ({
  recipientEmail,
  amount,
  currency = 'USD',
  note = 'InkBid article payment',
  articleId = 'N/A',
}) => {
  try {
    console.log('🚀 Initiating payout to seller...');
    console.log('Recipient Email:', recipientEmail);
    console.log('Amount:', amount, currency);

    const accessToken = await generateAccessToken();

    const payoutPayload = {
      sender_batch_header: {
        sender_batch_id: uuidv4(),
        email_subject: 'You’ve received a payment from InkBid!',
        email_message: `Your payout for article ${articleId} has been sent.`,
      },
      items: [
        {
          recipient_type: 'EMAIL',
          receiver: recipientEmail,
          note,
          amount: {
            value: amount.toFixed(2),
            currency,
          },
        },
      ],
    };

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/payments/payouts`,
      payoutPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('✅ Payout API Response:', response.data);

    return {
      success: true,
      batchId: response.data.batch_header.payout_batch_id,
      status: response.data.batch_header.batch_status,
      raw: response.data,
    };
  } catch (err) {
    console.error('❌ Payout Error:', err.response?.data || err.message);

    return {
      success: false,
      message: 'Failed to send payout',
      details: err.response?.data || err.message,
    };
  }
};
