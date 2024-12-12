export const HeartIcon = ({
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
      d="M22.1,3.4c-1.3-1.3-2.9-1.9-4.7-1.9s-3.4.7-4.7,1.9l-.7.7-.7-.7c-1.3-1.3-2.9-2-4.7-2s-3.4.7-4.7,1.9C.7,4.7,0,6.3,0,8.1,0,9.9.7,11.5,2,12.8l9.6,9.6c.1.1.3.2.5.2s.4,0,.5-.2l9.6-9.5c1.3-1.3,1.9-2.9,1.9-4.7,0-1.8-.7-3.4-1.9-4.7ZM21.1,11.8l-9.1,9.1L2.9,11.8c-1-1-1.5-2.3-1.5-3.7s.5-2.7,1.5-3.7c1-1,2.3-1.5,3.7-1.5s2.7.5,3.7,1.5l1.1,1.1c.3.3.7.3,1,0l1.1-1.1c1-1,2.3-1.5,3.7-1.5s2.7.5,3.7,1.5c1,1,1.5,2.3,1.5,3.7,0,1.4-.5,2.7-1.5,3.7Z"
    />
  </svg>
);
