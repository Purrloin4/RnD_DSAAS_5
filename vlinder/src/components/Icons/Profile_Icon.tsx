import Image from 'next/image';

import ProfileIconImage from './profile_icon.svg'

interface LogoComponentProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Profile_Icon: React.FC<LogoComponentProps> = ({ alt, className, width, height }) => {

  return (
    <div className={className}>
      <Image src={ProfileIconImage} alt={alt} layout="responsive" width={width} height={height} />
    </div>
  );
};

export default Profile_Icon;