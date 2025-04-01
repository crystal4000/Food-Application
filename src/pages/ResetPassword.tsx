import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sendPasswordResetEmail,
  AuthError,
  ActionCodeSettings,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { ResetPasswordFormValues, resetPasswordSchema } from "../utils/schema";
import { toast } from "sonner";
import { FaArrowLeft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import foodImage from "../assets/auth/login-img.svg";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues): Promise<void> => {
    // Configure the action code settings
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/new-password`,
      handleCodeInApp: true,
      iOS: {
        bundleId: "com.yourapp.ios",
      },
      android: {
        packageName: "com.yourapp.android",
        installApp: true,
        minimumVersion: "12",
      },
      dynamicLinkDomain: "yourapp.page.link", // Only if you're using Firebase Dynamic Links
    };

    try {
      await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
      toast.success("Password reset email sent! Please check your inbox.");
      window.setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      const firebaseError = error as AuthError;
      toast.error(firebaseError.message || "Failed to send reset email");
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
            Reset Your Password
          </h1>
          <p className="text-sm text-color-bg/70 text-center mb-8">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-10"
          >
            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-color-bg transition-colors duration-200">
                <span className="text-color-bg mr-2">
                  <MdEmail className="h-5 w-5" />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className="appearance-none bg-transparent border-none w-full text-color-bg mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-color-bg/50"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-color-bg hover:bg-custom-orange text-custom-orange-text hover:text-color-bg font-bold rounded-full transition duration-200"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-sm text-color-bg">
              Remember your password?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium text-custom-orange hover:text-custom-orange-hover cursor-pointer hover:underline"
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image with Overlay */}
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

export default ResetPassword;
