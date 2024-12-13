import { Card, Button } from "@nextui-org/react";
import { format } from "date-fns";
import Image from "next/image";

export default function ActivityCard({
  organization,
  picture_url,
  title,
  time,
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
  place: string;
  edit: Function;
  deleteActivity: Function;
  show_users: Function;
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

      <div className="w-full h-2/3 overflow-hidden rounded-lg">
        <Image src={picture_url || ""} width={1000} height={1000} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <p className="text-sm text-gray-500">{place}</p>
          {(() => {
            const [formattedDate, formattedTime] = formatActivityTime(time);
            return (
              <p className="text-sm text-gray-500">
                {formattedDate}
                <br />
                {formattedTime}
              </p>
            );
          })()}
        </div>

        <div className="ml-4 flex flex-row gap-2">
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
