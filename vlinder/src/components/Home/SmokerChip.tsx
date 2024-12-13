import { Chip } from "@nextui-org/react";
import { SmokerIcon } from "Components/Icons/SmokerIcon";

export default function SmokerChip({
  Smoker,
}: {
  Smoker: boolean | undefined;
}) {
  if (typeof Smoker === "undefined" || !Smoker) return;
  return (
    <Chip
      size="sm"
      className={`pl-2 text-white bg-yellow-800`}
      startContent={<SmokerIcon size={15} />}
    >
      Smoker
    </Chip>
  );
}
