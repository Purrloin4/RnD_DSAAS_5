"use client";
import React, { useEffect, useRef } from "react";
import { IRoom, useRooms } from "./rooms";

export default function InitRooms({ rooms }: { rooms: IRoom[] }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useRooms.setState({ rooms });
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return <></>;
}
