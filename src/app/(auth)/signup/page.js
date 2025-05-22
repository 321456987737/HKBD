"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// Schema with strong password rules
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export default function SimpleSignUp() {
  const [customError, setCustomError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setCustomError(""); // Reset error message

    try {
      const response = await axios.post("/api/signup", data);

      if (response.status === 201) {
        toast.success("Account created successfully!");

        // Automatically sign in the user after successful signup
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (signInResult?.error) {
          toast.error("Failed to sign in after signup. Please try signing in manually.");
          router.push("/signin");
        } else {
          router.push("/"); // Redirect to the homepage or dashboard
        }
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Signup failed. Please try again.";
      toast.error(errorMsg);

      if (
        errorMsg.toLowerCase().includes("already") ||
        errorMsg.toLowerCase().includes("test")
      ) {
        setCustomError(errorMsg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Get started with your free account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                {...register("username")}
                type="text"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter username"
              />
              <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                {...register("email")}
                type="email"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter email"
              />
              <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type="password"
                className={`w-full pr-3 pl-10 py-2 border rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter password"
              />
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Error Message */}
        {customError && (
          <p className="text-red-500 mt-4 text-center font-medium border border-red-300 bg-red-50 py-2 px-4 rounded">
            {customError}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}