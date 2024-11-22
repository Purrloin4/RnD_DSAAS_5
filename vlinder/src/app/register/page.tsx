"use client"
import { redirect, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react';

//Next-ui components
import { Input, Link, Button } from "@nextui-org/react";


//Components
import Logo from '@/src/components/Logo/Logo'

function Page() {
    return (
        <main className="flex items-center justify-center min-h-screen px-4"> 
  <div className="w-full max-w-md p-8 h-fit bg-white rounded-md shadow-md">
    <Logo alt="logo vlinder" className="pb-8 mx-auto" />
    <Input
      type="text"
      label="Access Token"
      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      className="max-w-full"
    />
    <Link className="block mt-2 text-sm text-blue-500" href="#">
      Request an access token
    </Link>
    <Button className="w-full mt-8" color="primary">
      Start my registration
    </Button>
  </div>
</main>

    );
}

export default Page