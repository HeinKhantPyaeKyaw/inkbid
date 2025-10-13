// config/paypal.config.js
import paypal from '@paypal/checkout-server-sdk';

// 🟢 PayPal Environment Setup
export function paypalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  // ⚙️ Sandbox Environment (use LiveEnvironment later)
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// 🧩 Create PayPal Client
export function paypalClient() {
  return new paypal.core.PayPalHttpClient(paypalEnvironment());
}

// ✅ Quick sanity check (optional debug log)
export function testPayPalConnection() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    console.error('❌ PayPal credentials missing! Check your .env file.');
  } else {
    console.log('✅ PayPal Sandbox Client Ready');
  }
}
