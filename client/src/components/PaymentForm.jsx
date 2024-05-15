import React, { useState } from "react";
import axios from "axios";
import "./PaymentForm.css";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error("Error creating payment method:", error);
      setPaymentError("Payment failed");
    } else {
      const { id } = paymentMethod;

      try {
        const response = await axios.post("/payments", {
          amount: 1000, // Replace with the actual amount
          currency: "usd", // Replace with the actual currency
          paymentMethodId: id,
          description: "Payment for an item", // Replace with the actual description
        });

        const { clientSecret } = response.data;

        const confirmPayment = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        if (confirmPayment.error) {
          console.error("Error confirming payment:", confirmPayment.error);
          setPaymentError("Payment failed");
        } else {
          console.log("Payment successful");
          setPaymentSuccess(true);
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        setPaymentError("Payment failed");
      }
    }
  };

  return (
    <div className="payment-container flex flex-col justify-center items-center">
        <CardElement className="CardElement" />
        <form className="w-full flex flex-col justify-center items-center" onSubmit={handleSubmit}>
            <button className="btn mt-5" type="submit" disabled={!stripe}>
                Pay
            </button>
        </form>
        {paymentError && <p>{paymentError}</p>}
        {paymentSuccess && <p>Payment successful!</p>}
    </div>
  );
};

export default PaymentForm;