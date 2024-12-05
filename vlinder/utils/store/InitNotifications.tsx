"use client";
import { useEffect, useRef } from "react";
import { INotification, useNotifications } from "./notifications";
import { LIMIT_MESSAGE } from "../constant";

export default function InitNotifications({ notifications }: { notifications: INotification[] }) {
  const initState = useRef(false);
  const hasMore = notifications.length >= LIMIT_MESSAGE;

  useEffect(() => {
    if (!initState.current) {
      useNotifications.setState({ notifications,hasMore});
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return null;
}
