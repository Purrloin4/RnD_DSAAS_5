"use client";
import { useState } from "react";

//Components
import { Progress } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

function RegisterLayout({
  step_one,
  step_two,
  step_tree,
  step_four,
}: {
  step_one: React.ReactNode;
  step_two: React.ReactNode;
  step_tree: React.ReactNode;
  step_four: React.ReactNode;
}) {
  const steps = [step_one, step_two, step_tree, step_four];
  const numberOfSteps = steps.length;
  const nextStep = () => {
    setStep(step < numberOfSteps - 1 ? step + 1 : numberOfSteps - 1);
  };

  const prevStep = () => {
    setStep(step > 0 ? step - 1 : 0);
  };

  const [step, setStep] = useState(0);

  return (
    <main className="">
      <Progress
        size="sm"
        radius="none"
        aria-label="steps"
        value={((step + 1) / numberOfSteps) * 100}
      />
      {steps[step]}
      <div className="w-full flex justify-center gap-4 absolute bottom-4">
        <Button onClick={prevStep} color="primary" className="min-w-fit w-1/3">
          Previous
        </Button>
        <Button onClick={nextStep} color="primary" className="min-w-fit w-1/3">
          Next
        </Button>
      </div>
    </main>
  );
}

export default RegisterLayout;
