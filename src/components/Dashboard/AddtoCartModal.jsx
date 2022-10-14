import React from "react";
import "../../css/addtocart.css";
import { CgClose } from "react-icons/cg";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddtoCartModal = ({
  show,
  falseAddCart,
  item,
  handleChange,
  handleClick,
}) => {
  if (!show) {
    return null;
  }
  console.log(show);

  const notify = () =>
    toast.success("Added to Cart!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <div className="addtocart" onClick={falseAddCart}>
      <div className="addtocart-content" onClick={(e) => e.stopPropagation()}>
        <div className="close-btn">
          {
            <CgClose
              onClick={() => {
                falseAddCart();
              }}
              className="close"
            />
          }
        </div>

        <div>
          <img className="add-item-image" src={item.img} alt="" />
          <h3>{item.name}</h3>
          <p className="add-item-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            inventore esse eius atque laborum quidem totam maiores? Dignissimos
            quo asperiores at in exercitationem totam voluptate consequatur iste
            hic. Dolores, itaque!
          </p>
          <div className="add-item-info">
            <p>NGN {item.price}</p>
            <p>10 - 20 Mins</p>
            <p>10 Pcs Available</p>
          </div>
          <div className="add-item-btns">
            <div className="addMinus-btns">
              <div className="addMinus" onClick={() => handleChange(item, 1)}>
                <FiPlus className="addMinus-icon" />
              </div>
              <p>{item.amount}</p>
              <div className="addMinus" onClick={() => handleChange(item, -1)}>
                <FiMinus className="addMinus-icon" />
              </div>
            </div>
            <button
              className="add-cart-btn"
              onClick={() => {
                handleClick(item);
                notify();
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddtoCartModal;
