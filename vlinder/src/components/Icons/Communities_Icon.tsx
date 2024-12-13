import Image from "next/image";

import CommunitiesIconImage from "./communities_icon.svg";

interface LogoComponentProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Communities_Icon: React.FC<LogoComponentProps> = ({ alt, className, width, height }) => {
  return (
    <div className={className}>
      <Image src={CommunitiesIconImage} alt={alt} layout="responsive" width={width} height={height} />
    </div>
  );
};

export default Communities_Icon;
