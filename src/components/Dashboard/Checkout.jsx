import React from "react";
import "../../css/checkout.css";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const Checkout = ({ show, falseCheckout, updateOrders, cart }) => {
  const [checkoutDetails, setCheckoutDetails] = useState({
    cardNumber: "",
    cardDate: "",
    cardCw: "",
    cardPin: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); //for form-data validation

  if (!show) {
    return null;
  }
  console.log(show);

  const handleChange = (e) => {
    console.log(e);
    setCheckoutDetails({
      ...checkoutDetails,
      [e.target.name]: e.target.value,
    });
  };
  const payment = () => {
    if (
      checkoutDetails.cardNumber === "" ||
      checkoutDetails.cardDate === "" ||
      checkoutDetails.cardCw === "" ||
      checkoutDetails.cardPin === ""
    ) {
      toast.warn("Complete Empty Fields");
    } else {
      toast.success("Payment Succesful");
      setCheckoutDetails({
        cardNumber: "",
        cardDate: "",
        cardCw: "",
        cardPin: "",
      });
      updateOrders(cart);
    }
  };

  return (
    <div className="checkout-modal" onClick={falseCheckout}>
      <div
        className="checkout-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="close-btn">
          {
            <FaTimes
              className="close"
              onClick={() => {
                falseCheckout();
              }}
            />
          }
        </div>
        <h1>Checkout</h1>

        <form
          className="checkout-form"
          onSubmit={handleSubmit((data, e) => {
            e.preventDefault();
            console.log("Manda");
            if (cart.length <= 0) {
              toast.warn("Add items to Cart!");
              return;
            }
            payment();
          })}
        >
          <input
            {...register("cardNumber", {
              required: "Card Number is required",
              minLength: {
                value: 16,
                message: "Minimnum Length for card number is 16 digits",
              },
              maxLength: {
                value: 19,
                message: "Maximum Length for card number is 16 digits",
              },
            })}
            type="number"
            name="cardNumber"
            placeholder="Card Number"
            onChange={handleChange}
            value={checkoutDetails.cardNumber}
          />
          <p className="errors">{errors.cardNumber?.message}</p>
          <input
            {...register("cardDate", { required: "Card Date is required" })}
            type="date"
            name="cardDate"
            placeholder="Exp Date"
            onChange={handleChange}
            value={checkoutDetails.cardDate}
          />
          <p className="errors">{errors.cardDate?.message}</p>
          <input
            {...register("cardCw", {
              required: "Card CW is required",
              minLength: {
                value: 3,
                message: "Minimnum Length for CW is 3 digits",
              },
              maxLength: {
                value: 3,
                message: "Maximum Length for CW is 3 digits",
              },
            })}
            type="password"
            name="cardCw"
            placeholder="CW/CW2"
            onChange={handleChange}
            value={checkoutDetails.cardCw}
          />
          <p className="errors">{errors.cardCw?.message}</p>
          <input
            {...register("cardPin", { required: "Card Pin is required" })}
            type="password"
            name="cardPin"
            placeholder="Card Pin"
            onChange={handleChange}
            value={checkoutDetails.cardPin}
          />
          <p className="errors">{errors.cardPin?.message}</p>

          <button
            className="cardPay-btn"
            type="submit"
            // onClick={() => {
            //   check();
            //   payment();
            // }}
          >
            Make Payment
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Checkout;
