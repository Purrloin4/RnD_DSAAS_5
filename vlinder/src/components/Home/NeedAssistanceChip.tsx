import { Chip } from "@nextui-org/react";

export default function NeedAssistanceChip({
  need_assistance,
}: {
  need_assistance: boolean | undefined;
}) {
  if (typeof need_assistance === "undefined" || !need_assistance) return;
  return (
    <Chip size="sm" className={` text-white bg-green-500`}>
      Need Assistance
    </Chip>
  );
}
