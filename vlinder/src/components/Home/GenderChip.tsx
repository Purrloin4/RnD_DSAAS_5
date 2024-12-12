import { Chip } from "@nextui-org/react";
import { MaleIcon } from "Components/Icons/MaleIcon";
import { FemaleIcon } from "Components/Icons/FemaleIcon";
import { OtherGenderIcon } from "Components/Icons/OtherGenderIcon";

import Gender from "@/src/enums/Gender";

export const GenderChip = ({ gender }: { gender?: Gender | string }) => {
  switch (gender) {
    case Gender.Male:
      return <GenderMaleChip />;
    case Gender.Female:
      return <GenderFemaleChip />;
    case Gender.Other:
      return <GenderOtherChip />;
    default:
      return;
  }
};

export function GenderMaleChip() {
  return (
    <Chip size="sm" className="pl-2 bg-blue-500 text-white" startContent={<MaleIcon size={15} />}>
      Male
    </Chip>
  );
}

export function GenderFemaleChip() {
  return (
    <Chip size="sm" className="pl-2 bg-rose-500 text-white" startContent={<FemaleIcon size={15} />}>
      Female
    </Chip>
  );
}

export default function GenderOtherChip() {
  return (
    <Chip
      size="sm"
      className="pl-2 bg-gradient-to-br from-blue-500 to-rose-500 text-white"
      startContent={<OtherGenderIcon size={15} />}
    >
      Other
    </Chip>
  );
}
