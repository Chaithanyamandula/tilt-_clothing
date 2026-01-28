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
    port: Number(process.env.SMTP_PORT), // FIXED
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  transporter.verify((err) => {
    if (err) console.error("SMTP ERROR ❌", err);
    else console.log("SMTP READY ✅");
  });

  const mailOptions = {
    from: `"TiLt Clothing" <${process.env.SMTP_EMAIL}>`, // FIXED
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
    console.error("SEND MAIL ERROR ❌", err);
    res.json({ success: false });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
