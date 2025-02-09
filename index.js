const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const Status = require("./model/statusModel");
const {
  getAccessToken,
  getOrderId,
  getPaymentKey,
} = require("./services/integrationServices");
const app = express();
const port = 3000 || process.env.PORT;

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://ahmed2005:ahmed2005@cluster0.0gm7l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    }
  )
  .then((conn) => {
    console.log(`Database Connected Successfully: ${conn.connection.host}`);
  })
  .catch((err) => {
    console.error(`Database Connection Error: ${err.message}`);
  });

// Paymob API Keys
const API_KEY =
  "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBd05EZzNNeXdpYm1GdFpTSTZJakUzTXprd05EYzRNREV1TlRFeU1UQTRJbjAub3lJUGFDdWhocmR6N05uYk5lelVrU1BDT0N3Nnp3NFlXdnU3TkhfNmhPcG1UOTlPTDdoVHRLWG5zODBfYjFxVEdLblRFTC1vMG5oNWwza2pGZlhWYWc=";
const SECRET_KEY =
  "egy_sk_test_b602fcf2e9f8f0cd79fed785be4edcc260424fdf1f15c06d9ebd831144fe4883";
const PUBLIC_KEY = "egy_pk_test_d3QY0JqYWxTIJ0sRVLlvoz3fhTBcESpM";

// نقطة النهاية لإنشاء عملية الدفع
app.post("/create-payment-intention", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const accessToken = await getAccessToken();
    const orderId = await getOrderId(accessToken, amount);
    const paymentToken = await getPaymentKey(accessToken, amount, orderId);

    const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/879841?payment_token=${paymentToken}`;

    res.json({ url: paymentUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/callback-payment", async (req, res) => {
  await Status.create({
    body: req.body,
    query: req.query,
  }).then((res) => {
    console.log(res)
  }).catch(err => {
    console.log("err", err.message)
  })
  res.status(200).json({ message: "ok" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
