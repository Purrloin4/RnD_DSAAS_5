import Image from 'next/image';

import MessagesIconImage from './messages_icon.svg'

interface LogoComponentProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Messages_Icon: React.FC<LogoComponentProps> = ({ alt, className, width, height }) => {

  return (
    <div className={className}>
      <Image src={MessagesIconImage} alt={alt} layout="responsive" width={width} height={height} />
    </div>
  );
};

export default Messages_Icon;