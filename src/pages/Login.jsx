import React, { useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  let navigate = useNavigate(); //for redirection on form and button

  //npm install react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); //for form-data validation

  const [passwordShown, setpasswordShown] = useState(false); //Initialize a boolean state called passwordShown to determine if the password in the input field should be shown using the useState() react hook.

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // chnage inverse the boolean state passwordShown
    setpasswordShown(!passwordShown);
  };

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    console.log(e);
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  const checkStorage = () => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user);
    if (
      loginDetails.email === user.email &&
      loginDetails.password === user.password
    ) {
      toast.success("Login Succesful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      // window.location("/dashboard");
      //console.log("Tania Nkoyo");
    } else {
      toast.error("Wrong Email or Password!");
    }
  };

  return (
    <section className="register-section">
      <div className="imgBx"></div>
      <div className="contentBx">
        <div className="signup-form">
          <h1>Welcome Back!</h1>

          {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
          <form
            onSubmit={handleSubmit((data, e) => {
              e.preventDefault();
              checkStorage();
            })}
          >
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
                {!passwordShown ? "show" : "close"}{" "}
                {/* set text to show or close if password is not shown */}
              </button>
            </div>

            <p className="errors">{errors.password?.message}</p>
            <button className="submit" type="submit">
              LOGIN
            </button>
            <div className="options">
              <p className="already" onClick={() => navigate("/signup")}>
                Create an account{" "}
              </p>
              <p className="already">Forgot Password</p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Login;
