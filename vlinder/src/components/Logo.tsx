import Image from 'next/image';

import LogoImage from './logo.svg'

interface LogoComponentProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoComponentProps> = ({ alt, className, width, height }) => {

  return (
    <div className={className}>
      <Image src={LogoImage} alt={alt} layout="responsive" width={width} height={height} />
    </div>
  );
};

export default Logo;
