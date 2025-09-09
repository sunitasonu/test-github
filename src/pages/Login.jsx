/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { postData } from "@/utils/api"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await postData("/login", {
        emailId: values.email,
        password: values.password,
      });

      if (response.success) {
        localStorage.setItem("accessToken", response.result.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.result.id,
            name: response.result.name,
            email: response.result.email,
            phone: response.result.mobileNo,
            position: response.result.position,
            address: response.result.address,
          })
        );
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(
          response.result.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.log("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden "
      >
        {/* Left Info Panel */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 text-white p-10 flex-col justify-center items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-24 w-24 rounded-full mb-6"
          />
          <h2 className="text-3xl font-bold mb-2">Welcome</h2>
          <p className="text-center text-sm leading-relaxed max-w-xs">
            Empower your business with smarter tools. We help you grow and scale
            with confidence.
          </p>
        </div>

        {/* Right Login Panel */}
        <div
          className="w-full md:w-1/2 p-8 bg-gradient-to-br from-blue-100 to-blue-300 flex-col justify-center items-center"
          style={{ borderColor: "#ccc" }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Login
              </CardTitle>
              <CardDescription className="text-gray-500">
                Access your account securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Username */}
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Username / Email ID
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Type here your name"
                      {...form.register("email")}
                      className="w-full pl-10"
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Type here your password"
                      {...form.register("password")}
                      className="w-full pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Log In"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-500">
                <Link
                  to="/forgot-password"
                  className="hover:underline text-blue-600"
                >
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
