"use client";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import type { Metadata } from "next";

//Next-ui components
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
//Components
import Logo from "Components/Logo";

export default function page() {
  const organisations = [
    { key: 0, label: "Leuven" },
    { key: 1, label: "Tienen" },
    { key: 2, label: "Mechelen" },
  ];

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 h-fit bg-white rounded-md shadow-md">
        <Logo alt="logo vlinder" className="pb-8 mx-auto" />
        <Input
          type="email"
          label="Email"
          placeholder="john.doe@vlinder.com"
          className="max-w-full"
        />

        <Select label="Select your organisation" className="max-w-full mt-4">
          {organisations.map((organisation) => (
            <SelectItem key={organisation.key}>{organisation.label}</SelectItem>
          ))}
        </Select>

        <Link className="block mt-2 text-sm text-blue-500" href="./" replace>
          I already have a token
        </Link>
        <Button className="w-full mt-8" color="primary">
          Request my token
        </Button>
      </div>
    </main>
  );
}
