"use client";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import type { Metadata } from "next";

//Next-ui components
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
//Components
import Logo from "Components/Logo/Logo";

export default function page() {
  const organisations = [
    { key: 0, label: "Leuven" },
    { key: 1, label: "Tienen" },
    { key: 2, label: "Mechelen" },
  ];

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md p-8">
        <Logo alt="Purple Logo" color="purple" className="w-full md-4" />
        <Input type="email" label="Email" placeholder="john.doe@vlinder.com" className="max-w-full" />

        <Select label="Select your organisation" className="max-w-full mt-4">
          {organisations.map((organisation) => (
            <SelectItem key={organisation.key}>{organisation.label}</SelectItem>
          ))}
        </Select>

        <Link className="w-full flex justify-center text-sm font-semibold text-primary" href="./" replace>
          I already have a token
        </Link>
        <Button size="lg" className="w-full md-4 btn-primary font-semibold" aria-label="request-access-token-button">
          Request my token
        </Button>
      </div>
    </main>
  );
}
