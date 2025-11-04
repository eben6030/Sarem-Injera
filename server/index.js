import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

app.use(cors{
  origin: process.env.CLIENT_URL,https://sarem-injera.vercel.app
  methods:["GET', "POST"],
    credentials: true,
});
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email, cart } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: email,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).send({ error: error.message });
  }
});

// Send emails after payment confirmation
app.post("/order-success", async (req, res) => {
  const { email, cart, totalAmount } = req.body;

  // --- 1️⃣ Setup Nodemailer transporter ---
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your gmail
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  const itemsList = cart.map((i) => `${i.name} - $${i.price}`).join("\n");

  // --- 2️⃣ Send email to customer ---
  const customerMail = {
    from: `"Sarem Injera" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Order Confirmation - Sarem Injera",
    text: `Hi there!

Thank you for your order from Sarem Injera! 🥙

Your order details:
${itemsList}

Total: $${totalAmount}

We’ll start preparing your order soon.

- Sarem Injera Team`,
  };

  // --- 3️⃣ Send email to store owner (you) ---
  const ownerMail = {
    from: `"Sarem Injera Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: "🧾 New Order Received",
    text: `New order from ${email}:

${itemsList}

Total: $${totalAmount}`,
  };

  try {
    await transporter.sendMail(customerMail);
    await transporter.sendMail(ownerMail);
    res.send({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
