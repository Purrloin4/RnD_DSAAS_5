export const FemaleIcon = ({
  size,
  width,
  height,
  ...props
}: {
  size?: number;
  width?: number;
  height?: number;
  props?: any;
}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    role="presentation"
    viewBox="0 0 24 24"
    height={size || height || 24}
    width={size || width || 24}
    {...props}
  >
    <path
      fill="currentColor"
      d="M20.8,8.8C20.8,4,16.8,0,12,0S3.2,4,3.2,8.8s3.5,8.3,8,8.7v2h-2.5c-.4,0-.8.3-.8.8s.3.8.8.8h2.5v2.2c0,.4.3.8.8.8s.8-.3.8-.8v-2.2h2.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8h-2.5v-2c4.5-.4,8-4.1,8-8.7ZM4.8,8.8c0-4,3.3-7.2,7.2-7.2s7.2,3.3,7.2,7.2-3.3,7.2-7.2,7.2-7.2-3.3-7.2-7.2Z"
    />
  </svg>
);
