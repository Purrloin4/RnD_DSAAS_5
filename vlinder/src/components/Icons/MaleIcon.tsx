export const MaleIcon = ({
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
      d="M23.9.5c0-.2-.2-.3-.4-.4,0,0-.2,0-.3,0h-5.3c-.4,0-.8.3-.8.8s.3.8.8.8h3.5l-7,7c-1.5-1.3-3.5-2.1-5.6-2.1C4,6.4,0,10.4,0,15.2s3.9,8.8,8.8,8.8,8.8-3.9,8.8-8.8-.8-4.1-2.1-5.6l7-7v3.5c0,.4.3.8.8.8s.8-.3.8-.8V.8c0,0,0-.2,0-.3ZM8.8,22.5c-4,0-7.2-3.3-7.2-7.2s3.3-7.3,7.2-7.3,7.2,3.3,7.2,7.3-3.3,7.2-7.2,7.2Z"
    />
  </svg>
);
