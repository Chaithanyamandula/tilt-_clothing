const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Buy request
app.post("/buy", async (req, res) => {
  const { product, price, name, phone, email, address } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"TiLt Clothing" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🛒 New Order - TiLt Clothing",
    html: `
      <h2>New Order Received</h2>
      <p><b>Product:</b> ${product}</p>
      <p><b>Price:</b> ₹${price}</p>
      <hr/>
      <h3>Customer Details</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Address:</b> ${address}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`TiLt Clothing running on http://localhost:${process.env.PORT}`);
});
