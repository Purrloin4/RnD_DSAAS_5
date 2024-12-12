import { Heading, Button, Html } from "@react-email/components";
import * as React from "react";

type WelcomeProps = {
  firstName: string;
  accessTokenId: string;
};

export default function Welcome({ firstName, accessTokenId }: WelcomeProps) {
  return (
    <Html>
      <Heading>Welcome, {firstName}</Heading>
      <Heading>Your token: {accessTokenId}</Heading> 
      <Button
        href={`https://rnd-dsaas-5.vercel.app/register`}
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Click me
      </Button>
    </Html>
  );
}
