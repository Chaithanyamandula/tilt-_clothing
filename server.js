const express = require("express");
const bodyParser = require("body-parser");
const { Resend } = require("resend"); // Switched to Resend SDK
require("dotenv").config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Buy request using Web API instead of SMTP
app.post("/buy", async (req, res) => {
  const { product, price, name, phone, email, address } = req.body;

  try {
    // In Resend Free Tier, if you haven't verified a domain, 
    // you MUST send from: 'onboarding@resend.dev'
    const { data, error } = await resend.emails.send({
      from: "TiLt Clothing <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL, 
      subject: "🛒 New Order - TiLt Clothing",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>New Order Received</h2>
          <p><b>Product:</b> ${product}</p>
          <p><b>Price:</b> ₹${price}</p>
          <hr/>
          <h3>Customer Details</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Address:</b> ${address}</p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR ❌", error);
      return res.json({ success: false, message: error.message });
    }

    console.log("Order Email Sent ✅", data.id);
    res.json({ success: true });

  } catch (err) {
    console.error("SERVER ERROR ❌", err);
    res.json({ success: false, message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
