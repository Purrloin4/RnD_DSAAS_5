import { Skeleton, Card } from "@nextui-org/react";

export default function ProfileCard({ className }: { className?: string }) {
  return (
    <Card
      className={`flex flex-col p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${className}`}
      data-testid="profile-suggestion-card"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-md mb-2">
        <Skeleton className="w-full h-full object-cover object-center border-r-medium" />
      </div>
      <Skeleton className="text-lg rounded-full w-3/4 font-semibold text-gray-800 mb-4">
        {"Unnamed User"}
      </Skeleton>
      <Skeleton className="justify-self-end w-full py-2 rounded-md">
        See Profile
      </Skeleton>
    </Card>
  );
}
