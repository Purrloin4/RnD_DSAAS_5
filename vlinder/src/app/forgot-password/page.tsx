"use client";
import { login } from '@/src/app/login/actions';
import { Button, Input} from "@nextui-org/react";
import Logo from "Components/Logo/Logo";
import React, { useState } from "react";
import { createClient } from '@/utils/supabase/client';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState<boolean>(false);

  const sendResetPassword = async () => {
    try {
      const { data: resetData, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to send password reset email.');
      

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster position="top-center" />
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

        <Button
          size="lg"
          className="w-full md-4 btn-primary"
          aria-label="reset-password-button"
          type="submit"
          onClick={sendResetPassword}
        >
          Reset my password
        </Button>

          </div>
    </div>
  );
}

