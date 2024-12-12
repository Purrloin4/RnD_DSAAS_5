import { useState } from "react";
import { Button } from "@nextui-org/react";

enum FriendBtnState {
  NotAFriend,
  Loading,
  AlreadyAFriend,
}

export default function AddFriendBtn({ isFriend }: { isFriend: boolean }) {
  const [addFriendBtnState, setAddFriendBtnState] = useState<FriendBtnState>(
    isFriend ? FriendBtnState.AlreadyAFriend : FriendBtnState.NotAFriend
  );

  const handeler = () => {
    if (addFriendBtnState === FriendBtnState.Loading) return;
    setAddFriendBtnState(FriendBtnState.Loading);

    if (addFriendBtnState === FriendBtnState.NotAFriend) {
      setTimeout(() => {
        setAddFriendBtnState(FriendBtnState.AlreadyAFriend);
      }, 200);
      return;
    }
    if (addFriendBtnState === FriendBtnState.AlreadyAFriend) {
      setTimeout(() => {
        setAddFriendBtnState(FriendBtnState.NotAFriend);
      }, 200);
      return;
    }
  };

  return (
    <Button
      onClick={handeler}
      isLoading={addFriendBtnState === FriendBtnState.Loading}
      className={`justify-self-end ${
        addFriendBtnState === FriendBtnState.AlreadyAFriend
          ? "bg-red-500 hover:bg-red-400"
          : "bg-blue-500 hover:bg-blue-400"
      } text-white w-full py-2 rounded-md transition-colors mb-2`}
    >
      {addFriendBtnState === FriendBtnState.AlreadyAFriend ? "Remove Friend" : "Add Friend"}
    </Button>
  );
}
