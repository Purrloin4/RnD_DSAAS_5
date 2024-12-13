import {
  Heading,
  Button,
  Html,
  Container,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type WelcomeProps = {
  firstName: string;
  accessTokenId: string;
};

export default function Welcome({ firstName, accessTokenId }: WelcomeProps) {
  return (
    <Html>
      <Container className="font-sans bg-gray-100 p-5">
        <Section className="bg-white rounded-lg p-5 shadow-md">
          <Heading className="text-gray-800 text-2xl mb-5">
            Welcome, {firstName}
          </Heading>
          <Text className="text-gray-600 text-base mb-5">
            Click the link to start your registration
          </Text>
          <Button
            href={`https://rnd-dsaas-5.vercel.app/register/${accessTokenId}`}
            className="bg-black text-white py-3 px-5 rounded"
          >
            Click me
          </Button>
          <Text className="text-gray-600 text-base mt-5">
            If the link does not work, please use the following access code:
          </Text>
          <Text className="text-gray-800 text-lg font-bold">
            {accessTokenId}
          </Text>
          <Text className="text-gray-600 text-base mt-2">
            Go to{" "}
            <a
              href="https://rnd-dsaas-5.vercel.app/register"
              className="text-blue-500 underline"
            >
              https://rnd-dsaas-5.vercel.app/register
            </a>{" "}
            and enter the access code to start your registration.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}
