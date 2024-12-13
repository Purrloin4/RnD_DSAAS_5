import { Chip } from "@nextui-org/react";

import SexualOrientation from "@/src/enums/SexualOrientation";

export const SexualOrientationChip = ({
  sexual_orientation,
}: {
  sexual_orientation?: SexualOrientation | string;
}) => {
  switch (sexual_orientation) {
    case SexualOrientation.Asexual:
      return <AsexualChip />;
    case SexualOrientation.Heterosexual:
      return <HeterosexualChip />;
    default:
      return;
  }
};

export function HeterosexualChip() {
  return (
    <Chip size="sm" className={` bg-gray-500 text-white`}>
      Heterosexual
    </Chip>
  );
}

export function AsexualChip() {
  return (
    <Chip size="sm" className={` text-white bg-purple-500`}>
      Asexual
    </Chip>
  );
}
