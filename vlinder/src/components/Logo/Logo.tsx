import React from "react";
import Image from "next/image";

// Import both logos
import LogoBlack from "Components/Logo/logo_black.svg";
import LogoPurple from "Components/Logo/logo_purple.svg";

interface LogoComponentProps {
  alt: string; // Alt text for accessibility
  className?: string; // Optional custom classes
  width?: number; // Width of the logo
  height?: number; // Height of the logo
  color?: "black" | "purple"; // Prop to determine which logo to display
}

const Logo: React.FC<LogoComponentProps> = ({
  alt,
  className,
  width,
  height,
  color = "black", // Default to black logo
}) => {
  // Determine which logo to display based on the color prop
  const selectedLogo = color === "purple" ? LogoPurple : LogoBlack;

  return (
    <div className={className}>
      <Image
        src={selectedLogo} // Dynamically use the selected logo
        alt={alt}
        layout="responsive"
        width={width}
        height={height}
      />
    </div>
  );
};

export default Logo;
