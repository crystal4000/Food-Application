import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { SignupFormValues, signupSchema } from "../utils/schema";
import { toast } from "sonner";
import { FaUser, FaEye, FaEyeSlash, FaLock, FaArrowLeft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaTwitter, FaInstagram, FaGoogle } from "react-icons/fa";

import foodImage from "../assets/auth/register-img.svg";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  const togglePassword = (): void => {
    setPasswordShown((prev) => !prev);
  };

  const onSubmit = async (data: SignupFormValues): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: data.name,
        });
      }

      toast.success("Signup Successful!");
      window.setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      const firebaseError = error as AuthError;
      toast.error(firebaseError.message || "An error occurred during signup");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white relative min-h-[100vh] md:min-h-0">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 md:top-8 left-4 md:left-8 flex items-center text-color-bg hover:text-custom-orange transition-colors duration-200"
        >
          <FaArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="w-full max-w-md px-4 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-color-bg">
            Let's Make Your Order
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-10"
          >
            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-color-bg transition-colors duration-200">
                <span className="text-color-bg mr-2">
                  <FaUser className="h-5 w-5" />
                </span>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Sara Tancredi"
                  className="appearance-none bg-transparent border-none w-full text-color-bg mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-color-bg/50"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-color-bg transition-colors duration-200">
                <span className="text-color-bg mr-2">
                  <MdEmail className="h-5 w-5" />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Sara.Tancredi@gmail.com"
                  className="appearance-none bg-transparent border-none w-full text-color-bg mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-color-bg/50"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-color-bg transition-colors duration-200">
                <span className="text-color-bg mr-2">
                  <FaLock className="h-5 w-5" />
                </span>
                <input
                  {...register("password")}
                  type={passwordShown ? "text" : "password"}
                  placeholder="Password"
                  className="appearance-none bg-transparent border-none w-full text-color-bg mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-color-bg/50"
                />
                <button
                  onClick={togglePassword}
                  type="button"
                  className="text-color-bg"
                >
                  {passwordShown ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-color-bg hover:bg-custom-orange text-custom-orange-text hover:text-color-bg font-bold rounded-full transition duration-200"
            >
              Sign up
            </button>
          </form>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-sm text-color-bg">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium text-custom-orange hover:text-custom-orange-hover cursor-pointer hover:underline"
              >
                Log in
              </span>
            </p>
          </div>

          <div className="mt-6 md:mt-8">
            <div className="flex items-center justify-center space-x-4">
              <p className="text-sm font-medium text-color-bg">Follow us</p>
              {/* Social Icons */}
              <a href="#" className="text-color-bg hover:text-custom-orange">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-color-bg hover:text-custom-orange">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-color-bg hover:text-custom-orange">
                <FaGoogle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Food Image with Overlay */}
      <div className="hidden md:block w-full md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-custom-orange/40 to-color-bg/40 z-10" />
        <div
          className="h-full w-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${foodImage})`,
            backgroundPosition: "center center",
          }}
        />
      </div>
    </div>
  );
};

export default Signup;
