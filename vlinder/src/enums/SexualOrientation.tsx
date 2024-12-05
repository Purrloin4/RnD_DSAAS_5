enum SexualOrientation {
  Heterosexual = "Heterosexual",
  Asexual = "Asexual",
}

const SexualOrientationDisplayNames: Record<SexualOrientation, string> = {
  [SexualOrientation.Heterosexual]: "Heterosexual",
  [SexualOrientation.Asexual]: "Asexual",
};

export default SexualOrientation;
export { SexualOrientationDisplayNames };
