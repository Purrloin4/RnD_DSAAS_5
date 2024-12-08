"use client";

import React from "react";
import { IFriendship } from "@/utils/store/friendships";
import { Avatar, Button } from "@nextui-org/react";

interface FriendshipListProps {
  friendships: IFriendship[];
}

export default function FriendshipList({ friendships }: FriendshipListProps) {
  return (
    <div className="p-4 bg-white rounded-md shadow-md w-full">
      <h3 className="text-lg font-semibold mb-4">Friends</h3>
      {friendships.length === 0 ? (
        <p className="text-gray-500">No friends yet.</p>
      ) : (
        <ul className="space-y-4">
          {friendships.map((friendship, index) => {
            const friend =
              friendship.profile_1_details?.id === friendship.profile_2_id
                ? friendship.profile_2_details
                : friendship.profile_1_details;

            return (
              <li key={index} className="flex items-center space-x-4">
                <Avatar
                  src={friend?.avatar_url || "/default-avatar.png"}
                  alt={friend?.username || "Friend"}
                  className="w-12 h-12"
                />
                <div>
                  <p className="font-medium text-gray-800">{friend?.username || "Unknown"}</p>
                  <p className="text-sm text-gray-500">Friend since: {new Date(friendship.created_at!).toLocaleDateString()}</p>
                </div>
                <Button color="secondary" size="sm" className="ml-auto">
                  View Profile
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
