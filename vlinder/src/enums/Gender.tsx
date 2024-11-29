enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

const GenderDisplayNames: { [key in Gender]: string } = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
  [Gender.Other]: "Other (Non-binary)",
};

export default Gender;
export { GenderDisplayNames };
