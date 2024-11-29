import { login, signup } from './actions';

import { Button, Input } from "@nextui-org/react";

export default function LoginPage() {
  const widthClass = "w-[70%]"; // Change this to "w-[70%]" to update all widths

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4 w-full">
        <Input
          type="text"
          label="Email/Phone number"
          placeholder="Enter your email or phone number"
          className={widthClass}
        />

        {/* Password Input */}
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          className={widthClass}
        />

        {/* Login Button */}
        <Button
          size="lg"
          className={`${widthClass} bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg py-3`}
          aria-label="login-button"
        >
          Login
        </Button>
      </div>
    </div>
  );
}
