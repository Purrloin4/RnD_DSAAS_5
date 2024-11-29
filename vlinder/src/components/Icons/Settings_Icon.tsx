import Image from 'next/image';

import SettingsIconImage from './settings_icon.svg'

interface LogoComponentProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Settings_Icon: React.FC<LogoComponentProps> = ({ alt, className, width, height }) => {

  return (
    <div className={className}>
      <Image src={SettingsIconImage} alt={alt} layout="responsive" width={width} height={height} />
    </div>
  );
};

export default Settings_Icon;