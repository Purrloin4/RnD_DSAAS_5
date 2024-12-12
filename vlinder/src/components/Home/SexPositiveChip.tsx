import { Chip } from "@nextui-org/react";
import { HeartCrossIcon } from "Components/Icons/HeartCrossIcon";
import { HeartIcon } from "Components/Icons/HeartIcon";

export default function SexPositiveChip({ sex_positive }: { sex_positive: boolean | undefined }) {
  if (typeof sex_positive === "undefined") return;
  return (
    <Chip
      size="sm"
      className={`pl-2 text-white ${sex_positive ? "bg-pink-500" : "bg-gray-500"}`}
      startContent={sex_positive ? <HeartIcon size={15} /> : <HeartCrossIcon size={15} />}
    >
      {sex_positive ? "Sex Positive" : "Not Sex Positve"}
    </Chip>
  );
}
