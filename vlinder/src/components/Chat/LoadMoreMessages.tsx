import React from "react";
import { Button } from "@nextui-org/button";
import { createClient } from "@/utils/supabase/client";
import { LIMIT_MESSAGE } from "@/utils/constant/constants";
import { getFromAndTo } from "@/utils/utils";
import { useMessage } from "@/utils/store/messages";
import { toast } from "sonner";

export default function LoadMoreMessages() {
  const page = useMessage((state) => state.page);
  const setMesssages = useMessage((state) => state.setMesssages);
  const hasMore = useMessage((state) => state.hasMore);

  const fetchMore = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*,profiles(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMesssages(data.reverse());
    }
  };

  if (hasMore) {
    return (
      <Button variant="flat" className="w-full" onClick={fetchMore}>
        Load More
      </Button>
    );
  }
  return <></>;
}
