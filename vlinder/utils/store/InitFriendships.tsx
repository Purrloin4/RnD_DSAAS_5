"use client";
import React, { useEffect, useRef } from "react";
import { IFriendship, useFriendships } from "./friendships";

export default function InitFriendships({ friendships }: { friendships: IFriendship[] }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useFriendships.setState({ friendships });
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return <></>;
}
