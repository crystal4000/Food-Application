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
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-teal-700 to-emerald-900 overflow-hidden">
      <div className="absolute top-20 sm:top-40 right-8 sm:right-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 rounded-full bg-teal-400/20 blur-3xl"></div>
      <div className="absolute bottom-20 sm:bottom-40 left-8 sm:left-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 rounded-full bg-teal-500/10 blur-3xl"></div>

      <div className="w-full md:w-1/2 flex items-center justify-center min-h-screen p-4 md:p-8 relative z-10">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center text-white/90 hover:text-custom-orange transition-colors duration-200"
        >
          <FaArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm font-medium">Back</span>
        </button>

        <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-6 py-6 sm:py-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-white">
            Let's Make Your Order
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-white/80 transition-colors duration-200">
                <span className="text-white/90 mr-2">
                  <FaUser className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Sara Tancredi"
                  className="appearance-none bg-transparent border-none w-full text-white text-sm sm:text-base mr-3 py-1 px-1 sm:px-2 leading-tight focus:outline-none placeholder-white/50"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-white/80 transition-colors duration-200">
                <span className="text-white/90 mr-2">
                  <MdEmail className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Sara.Tancredi@gmail.com"
                  className="appearance-none bg-transparent border-none w-full text-white text-sm sm:text-base mr-3 py-1 px-1 sm:px-2 leading-tight focus:outline-none placeholder-white/50"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-white/80 transition-colors duration-200">
                <span className="text-white/90 mr-2">
                  <FaLock className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <input
                  {...register("password")}
                  type={passwordShown ? "text" : "password"}
                  placeholder="Password"
                  className="appearance-none bg-transparent border-none w-full text-white text-sm sm:text-base mr-3 py-1 px-1 sm:px-2 leading-tight focus:outline-none placeholder-white/50"
                />
                <button
                  onClick={togglePassword}
                  type="button"
                  className="text-white/90"
                >
                  {passwordShown ? (
                    <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-custom-orange to-amber-500 hover:from-custom-orange-hover hover:to-amber-600 text-emerald-900 font-bold rounded-full transition duration-300 shadow-lg text-sm sm:text-base"
            >
              Sign up
            </button>
          </form>

          <div className="mt-4 sm:mt-6 md:mt-8 text-center">
            <p className="text-xs sm:text-sm text-white/90">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium text-custom-orange hover:text-amber-400 cursor-pointer hover:underline transition-colors duration-200"
              >
                Log in
              </span>
            </p>
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <p className="text-xs sm:text-sm font-medium text-white/90">
                Follow us
              </p>
              <a
                href="#"
                className="p-1.5 sm:p-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <FaTwitter className="h-3 w-3 sm:h-4 sm:w-4 text-white/90" />
              </a>
              <a
                href="#"
                className="p-1.5 sm:p-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <FaInstagram className="h-3 w-3 sm:h-4 sm:w-4 text-white/90" />
              </a>
              <a
                href="#"
                className="p-1.5 sm:p-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <FaGoogle className="h-3 w-3 sm:h-4 sm:w-4 text-white/90" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-custom-orange/30 to-emerald-900/70 backdrop-blur-sm z-10" />
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
