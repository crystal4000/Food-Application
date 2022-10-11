import React from "react";
import "../css/signup.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  let navigate = useNavigate(); //for redirection on form and button

  //npm install react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); //for form-data validation

  console.log(errors);

  const [passwordShown, setpasswordShown] = useState(false); //Initialize a boolean state called passwordShown to determine if the password in the input field should be shown using the useState() react hook.

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // chnage inverse the boolean state passwordShown
    setpasswordShown(!passwordShown);
  };

  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setSignupDetails({
      ...signupDetails,
      [e.target.name]: e.target.value,
    });
  };
  console.log(signupDetails);
  return (
    <section className="register-section">
      <div className="imgBx">
        {/*<div id="overlay"></div>
        <img src={IMG} alt="" />*/}
      </div>
      <div className="contentBx">
        <div className="signup-form">
          <h1>Welcome to Lilies!</h1>

          {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
          <form
            onSubmit={handleSubmit((data, e) => {
              e.preventDefault();
              console.log(data);
              sessionStorage.setItem("user", JSON.stringify(signupDetails));
              toast.success("Signup Succesful!");
              setInterval(() => {
                navigate("/login");
              }, 3000);
            })}
          >
            <input
              {...register("name", { required: "This is required" })}
              type="text"
              placeholder="Your Name"
              name="name"
              onChange={handleChange}
            />
            <p className="errors">{errors.name?.message}</p>
            <input
              {...register("email", { required: "This is required" })}
              type="email"
              placeholder="Your Email address"
              name="email"
              onChange={handleChange}
            />
            <p className="errors">{errors.email?.message}</p>
            <div className="password">
              <input
                {...register("password", { required: "This is required" })}
                type={passwordShown ? "text" : "password"}
                placeholder="Your Password"
                name="password"
                onChange={handleChange}
              />
              <button
                onClick={togglePassword}
                className="show-btn"
                type="button"
              >
                {!passwordShown ? "show" : "close"}
                {/* set text to show or close if password is not shown */}
              </button>
            </div>

            <p className="errors">{errors.password?.message}</p>
            <button className="submit" type="submit">
              SIGN UP
            </button>
            <p className="already">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>LOGIN</span>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Signup;
