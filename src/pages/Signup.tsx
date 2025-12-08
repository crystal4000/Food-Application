import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const togglePassword = (): void => {
    setPasswordShown((prev) => !prev);
  };

  const onSubmit = async (data: SignupFormValues): Promise<void> => {
    setIsSubmitting(true);
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update profile with name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: data.name,
        });

        // Send verification email
        await sendEmailVerification(userCredential.user);
      }

      toast.success(
        "Account created! Please check your email to verify your account."
      );

      // Sign out user until they verify
      await auth.signOut();

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please login.");
      } else if (firebaseError.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else {
        toast.error(firebaseError.message || "An error occurred during signup");
      }
    } finally {
      setIsSubmitting(false);
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
            Create Account
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            {/* Name Input */}
            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-white/80 transition-colors duration-200">
                <span className="text-white/90 mr-2">
                  <FaUser className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Full Name"
                  className="appearance-none bg-transparent border-none w-full text-white text-sm sm:text-base mr-3 py-1 px-1 sm:px-2 leading-tight focus:outline-none placeholder-white/50"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs sm:text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-white/80 transition-colors duration-200">
                <span className="text-white/90 mr-2">
                  <MdEmail className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="appearance-none bg-transparent border-none w-full text-white text-sm sm:text-base mr-3 py-1 px-1 sm:px-2 leading-tight focus:outline-none placeholder-white/50"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs sm:text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
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
                  type="button"
                  onClick={togglePassword}
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
                <p className="text-red-400 text-xs sm:text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 sm:py-3 bg-gradient-to-r from-custom-orange to-amber-500 hover:from-amber-500 hover:to-custom-orange text-emerald-900 font-semibold rounded-full transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-1 border-t border-white/30"></div>
            <span className="px-3 sm:px-4 text-white/70 text-xs sm:text-sm">
              or continue with
            </span>
            <div className="flex-1 border-t border-white/30"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-3 sm:gap-4">
            <button className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition duration-300">
              <FaGoogle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
            <button className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition duration-300">
              <FaTwitter className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
            <button className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition duration-300">
              <FaInstagram className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center mt-4 sm:mt-6 text-white/80 text-xs sm:text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-custom-orange hover:text-amber-400 font-semibold transition-colors"
            >
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 relative z-10">
        <div className="max-w-lg">
          <img
            src={foodImage}
            alt="Food illustration"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
