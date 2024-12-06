"use client";
import React, { useEffect, useRef } from "react";
import { IRoomParticipant, useRoomParticipant } from "./roomParticipant";

export default function InitRoomParticipant({ participants }: { participants: IRoomParticipant[] }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useRoomParticipant.setState({ participants });
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return <></>;
}
