# InkBid — Real-Time Article Auction Platform
<picture>
<img alt="inkbid-profile.png" src="frontend/public/images/readme_profile.png">
</picture>

### Demo Video

**[Video Link](https://youtu.be/uP--W354lyQ)**

---

## 🧠 Overview

InkBid is a **real-time auction marketplace** where writers sell digital articles and buyers compete through live bidding. The platform is built for transparency — real-time bidding history and AI validator to check AI generated content for the articles, and collaboration — combining Stripe-powered payments, contract generation, and a real-time notification system.

---

## ⚙️ Tech Stack

| Layer                  | Technologies                                                                     |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Frontend**           | Next.js 14, TypeScript, Tailwind CSS, React Query, Socket.IO Client              |
| **Backend**            | Node.js, Express.js, MongoDB, Mongoose, Socket.IO, BullMQ (Redis), PayPal API    |
| **Infrastructure**     | AWS EC2 (Ubuntu), Nginx Reverse Proxy                                            |
| **Storage**            | MongoDB Atlas, Firebase Storage                                                  |
| **Messaging & Queues** | Redis + BullMQ                                                                   |
| **Payments**           | Paypal Checkout, Webhook validation                                              |

---

## 🚀 Key Features

* **Live bidding:** Real-time updates with Socket.IO, and optimistic locking with first-write-wins logic to handle concurrent bids.
* **Secure payments"** PayPal Checkout, including payouts handling to service InkBid platform fees. 
* **Contract generation:** Auto-generated contracts to bind the transaction between the author(seller) and buyer.
* **Real-time notifications:** Events triggered notification system to notify bidding, status, and payment updates.
* **Seller dashboard** Track listings, contracts, and generated revenue.
* **Buyer dashboard** Manage bids, payments, and purchased articles.
* **Background Jobs** BullMQ + Redis for job queues and articles finalization.

---

## 📜 License

This project is licensed under the King Mongkut's University of Technology Thonburi License.
