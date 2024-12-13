import { Card, Button } from "@nextui-org/react";
import { format } from "date-fns";
import Image from "next/image";

export default function ActivityCard({
  organization,
  picture_url,
  title,
  time,
  desc,
  place,
  edit,
  deleteActivity,
  show_users,
  canEdit,
}: {
  organization?: string;
  picture_url: string;
  title: string;
  time: string;
  desc: string;
  place: string;
  edit: () => void;
  deleteActivity: () => void;
  show_users: () => void;
  canEdit: boolean;
}) {
  const formatActivityTime = (isoString: string): string[] => {
    const date = new Date(isoString);
    const formattedDate = format(date, "EEEE, MMM d, yyyy");
    const formattedTime = format(date, "HH:mm");
    return [formattedDate, formattedTime];
  };

  return (
    <Card className="relative flex-shrink-0 w-[85%] sm:w-[42.5%] md:w-[28.33%] h-[30vh] bg-white border border-gray-200 shadow-xl rounded-lg flex flex-col">
      {organization && (
        <div className="absolute top-4 right-4 bg-purple-500 text-white text-sm font-bold rounded-lg p-2">
          {organization}
        </div>
      )}

      <div className="w-full h-2/3 overflow-hidden rounded-t-lg">
        <Image src={picture_url || ""} width={1000} height={1000} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="w-full flex flex-col items-start justify-between p-4">
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          {(() => {
            const [formattedDate, formattedTime] = formatActivityTime(time);
            return <p className="text-sm text-gray-500">{`At ${place}, ${formattedTime} ${formattedDate}`}</p>;
          })()}
          <p className="text-gray-600 line-clamp-3 overflow-hidden text-ellipsis text-wrap truncate break-all mb-4">
            {desc}
          </p>
        </div>

        <div className="w-full justify-end flex flex-row gap-2">
          {canEdit && (
            <>
              <Button size="sm" color="danger" aria-label="delete-button" onClick={() => deleteActivity()}>
                Delete
              </Button>
              <Button size="sm" color="success" aria-label="edit-button" onClick={() => edit()}>
                Edit
              </Button>
            </>
          )}

          <Button size="sm" className="btn-primary" aria-label="show-users-button" onClick={() => show_users()}>
            Show Users
          </Button>
        </div>
      </div>
    </Card>
  );
}
