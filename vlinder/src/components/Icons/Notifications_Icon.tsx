import Image from 'next/image';

import NotificationsIconImage from './notifications_icon.svg'

interface LogoComponentProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Notifications_Icon: React.FC<LogoComponentProps> = ({ alt, className, width, height }) => {

  return (
    <div className={className}>
      <Image src={NotificationsIconImage} alt={alt} layout="responsive" width={width} height={height} />
    </div>
  );
};

export default Notifications_Icon;