import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@nextui-org/react';
import {  Listbox,  ListboxSection,  ListboxItem} from "@nextui-org/listbox";


interface Friendship {
  id: string;
  friend_id: string;
  friend_username: string;
  friend_avatar: string | null;
}
interface FriendshipListProps {
    friendships: Friendship[];
}

export default function FriendshipList({ friendships }: FriendshipListProps) {
    const router = useRouter();

    const handleNavigation = (id: string) => {
        router.push(`/profile/${id}`);
    };

    return (
        <Listbox>
            {friendships.map((friend) => (
                <ListboxItem
                    key={friend.id}
                    className="cursor-pointer hover:bg-gray-100 p-3 rounded-md"
                    onClick={() => handleNavigation(friend.friend_id)}
                >
                    <div className="flex items-center gap-3">
                        <Avatar
                    src={friend.friend_avatar || '/default-avatar.png'} 
                      alt={friend.friend_username}
                            size="md"
                            className="cursor-pointer"
                        />
                        <span className="font-semibold">{ friend.friend_username}</span>
                    </div>
                </ListboxItem>
            ))}
        </Listbox>
    );
}
