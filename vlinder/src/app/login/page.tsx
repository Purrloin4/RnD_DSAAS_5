"use client";
import { login } from './actions';
import { Button, Input, Link } from "@nextui-org/react";
import Logo from "Components/Logo/Logo";
import React, { useState } from "react";
import {EyeFilledIcon} from "Components/Icons/EyeFilledIcon";
import {EyeSlashFilledIcon} from "Components/Icons/EyeSlashFilledIcon";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false); // State for toggling password visibility

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await login(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md p-8">
        <Logo alt="Purple Logo" color="purple" className="w-full md-4" />

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          label="Email/Phone number"
          placeholder="Enter your email or phone number"
          className="w-full md-4"
        />

        <div className="relative w-full">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={isVisible ? "text" : "password"} // Toggle between text and password
            label="Password"
            placeholder="Enter your password"
            className="w-full md-4"
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none"
            type="button"
            onClick={toggleVisibility}
            aria-label="toggle password visibility"
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        </div>

        <div className="w-full flex justify-end">
          <Link
            href="/forgot-password"
            color="primary"
            className="text-sm font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          size="lg"
          className="w-full md-4 btn-primary"
          aria-label="login-button"
          type="submit"
          onClick={handleLogin}
        >
          Login
        </Button>

        <div className="w-full flex justify-center">
          <Link href="/register" color="primary" className="text-sm font-semibold">
            <span>Don't have an account?</span>
            <span className="ml-2 underline">Request access!</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

