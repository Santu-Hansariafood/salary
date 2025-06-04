"use client";

import React, { useState } from "react";
import RadioButton from "@/components/common/RadioButton/RadioButton";
import Buttons from "@/components/common/Buttons/Buttons";
import InputBox from "@/components/common/InputBox/InputBox";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("employee");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMobile = mobile.trim();

    // Basic validation for 10-digit mobile number
    if (!/^\d{10}$/.test(trimmedMobile)) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      mobile: trimmedMobile,
      password,
      loginType,
    });

    if (res.ok) {
      toast.success("Login successful!");

      router.push(loginType === "admin" ? "/admin" : "/home");
    } else {
      toast.error(
        loginType === "admin"
          ? "Invalid admin credentials"
          : "Invalid employee credentials"
      );
    }
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setMobile("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight drop-shadow">
          {loginType === "admin" ? "Admin Login" : "Employee Login"}
        </h2>

        <div className="flex gap-8 mb-6 justify-center">
          <RadioButton
            name="loginType"
            value="employee"
            checked={loginType === "employee"}
            onChange={() => handleLoginTypeChange("employee")}
            label="Employee"
          />
          <RadioButton
            name="loginType"
            value="admin"
            checked={loginType === "admin"}
            onChange={() => handleLoginTypeChange("admin")}
            label="Admin"
          />
        </div>

        <InputBox
          label="Mobile Number"
          type="tel"
          name="mobile"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/, "").slice(0, 10))
          }
          placeholder={
            loginType === "admin"
              ? "Enter admin mobile number"
              : "Enter your mobile number"
          }
          required
        />

        <InputBox
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={
            loginType === "admin"
              ? "Enter admin password"
              : "Enter your password"
          }
          required
        />

        <div className="mt-8">
          <Buttons size="md" color="primary" className="w-full" type="submit">
            {loginType === "admin" ? "Admin Login" : "Employee Login"}
          </Buttons>
        </div>
      </form>
    </div>
  );
};

export default Login;
