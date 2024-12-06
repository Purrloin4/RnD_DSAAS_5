enum LookingFor {
  Friends = "Friends",
  PartnerAndFriends = "Partner and Friends",
}

const LookingForDisplayNames: Record<LookingFor, string> = {
  [LookingFor.Friends]: "Friends",
  [LookingFor.PartnerAndFriends]: "Partner and Friends",
};

export default LookingFor;
export { LookingForDisplayNames };
