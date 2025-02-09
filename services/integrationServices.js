exports.getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: API_KEY,
      }
    );
    return response.data.token;
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get access token");
  }
};

// دالة لإنشاء الطلب والحصول على Order ID

exports.getOrderId = async (accessToken, amount) => {
  try {
    const response = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: accessToken,
        delivery_needed: false,
        amount_cents: amount * 100,
        currency: "EGP",
        items: [],
      }
    );
    return response.data.id;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create order");
  }
};

// دالة لإنشاء Payment Key
exports.getPaymentKey = async (accessToken, amount, orderId) => {
  try {
    const response = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: accessToken,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "dumy",
          first_name: "Ahmed",
          last_name: "Elshhat",
          street: "hamed badr street",
          building: "5",
          phone_number: "+201123579361",
          city: "sharqia",
          country: "zagazig",
          email: "a7medelshhat@gmail.com",
          floor: "2",
          state: "dumy",
        },
        currency: "EGP",
        integration_id: 4871390,
      },
    );
    return response.data.token;
  } catch (error) {
    console.error(
      "Error getting payment key:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get payment key");
  }
};