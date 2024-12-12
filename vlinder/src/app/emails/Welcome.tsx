import {Heading, Button, Html } from "@react-email/components";
import * as React from "react";

type WelcomeProps = {
firstName:string;
};

export default function Welcome({firstName}:WelcomeProps) {
  return (
    <Html>
        <Heading> Welcome,{firstName}</Heading>
      <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Click me
      </Button>
    </Html>
  );
}
