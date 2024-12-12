export const OtherGenderIcon = ({
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
      d="M23.9,11.4c0,0,0-.2-.2-.2l-4.6-4.6c-.3-.3-.8-.3-1.1,0s-.3.8,0,1.1l3.3,3.3h-4.3v-2.5c0-.4-.3-.8-.8-.8s-.8.3-.8.8v2.5h-1.1c-.4-3.6-3.4-6.4-7.1-6.4S.1,7.8.1,11.7s3.2,7.1,7.1,7.1,6.7-2.8,7.1-6.4h1.1v2.6c0,.4.3.8.8.8s.8-.3.8-.8v-2.6h4.3l-3.3,3.3c-.3.3-.3.8,0,1.1s.3.2.5.2.4,0,.5-.2l4.6-4.6c0,0,.1-.2.2-.2,0-.2,0-.4,0-.6ZM7.3,17.3c-3.1,0-5.6-2.5-5.6-5.6s2.5-5.6,5.6-5.6,5.7,2.5,5.7,5.6-2.5,5.6-5.7,5.6Z"
    />
  </svg>
);
