const express = require("express");
const paymentRouter = express.Router();
const Paystack = require("@paystack/paystack-sdk");
const crypto = require("crypto");
//
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
//get database
const paymentsOrder = [];
//
paymentRouter.post("/paystack/init", async (req, res) => {
  try {
    const { email, amount, userId, plan } = req.body;
    //
    const orderId = `D'RAHIM_${crypto.randomBytes(10).toString("hex")}`;
    const reference = `PS_${crypto.randomBytes(10).toString("hex")}`;
    const orderRecipt = {
      orderId,
      userId,
      email,
      amount,
      plan,
      reference,
      status: "pending",
      createdAt: new Date(),
    };
    paymentsOrder.push(orderRecipt);
    //init transaction/ make payment
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // kobo multiply by 100 to get naira value
      reference,
      metadata: {
        orderId,
        userId,
        plan,
        custom_fields: [
          {
            display_name: "Oder ID",
            variable_name: "order_id",
            value: orderId,
          },
        ],
      },
    });
    if (!response.status) {
      throw new Error(response.message);
    }
    res
      .status(200)
      .json({ ok: true, reference: reference.data.reference, orderId });
  } catch (error) {
    res.status(500).json({ ok: false, error: `${error}` || "Init failed" });
  }
});

//validate payment
paymentRouter.post("/verify", async (req, res) => {
  try {
    const { reference } = req.body;
    const response = await paystack.transaction.verify(reference);

    if (!response.status) {
      return res.status(200)({ ok: false, message: response.message });
    }
    const tx = response.data;
    if (tx.status === "success") {
      const orderId = tx.meta.orderId;
      const order = orders.get(orderId);

      return res.json({ ok: true, success: true, data: tx, order });
    }
    return res.json({ pk: false, success: false, data: tx, order });
  } catch (error) {
    res.status(500).json({ ok: false, error: `verify failed : ${error}` });
  }
});

paymentRouter.post("/paystack/webhook", async (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.body)
    .digest("hex");
  if (hash !== req.headers["x-paystack-signature"]) return res.status(401);
  const event = JSON.parse(req.body.toString());
  if (event.event === "charge.success") {
    const orderId = event.data.metadata.orderId; //this was set in init
    const order = paymentsOrder.fing(orderId); //get order from stored in db
    if (order.status === "pending") {
      ((order.status = "paid"), (order.paidAt = event.data.paid_at));
      order.set(orderId, order);
      console.log("Webhook paid : ", orderId);
    }
  }
  res.sendStatus(200);
});
