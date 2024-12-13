import Image from "next/image";

import NavbarLogoImage from "./navbar_logo.svg";

interface LogoComponentProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Navbar_Logo: React.FC<LogoComponentProps> = ({ alt, className, width, height }) => {
  return (
    <div className={className}>
      <Image src={NavbarLogoImage} alt={alt} layout="responsive" width={width} height={height} />
    </div>
  );
};

export default Navbar_Logo;
