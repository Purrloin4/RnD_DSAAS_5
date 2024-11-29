enum SexualOrientation {
  Male = "Male",
  Female = "Female",
  Both = "Both",
}

const SexualOrientationDisplayNames: { [key in SexualOrientation]: string } = {
  [SexualOrientation.Male]: "Male",
  [SexualOrientation.Female]: "Female",
  [SexualOrientation.Both]: "Both",
};

export default SexualOrientation;
export { SexualOrientationDisplayNames };
