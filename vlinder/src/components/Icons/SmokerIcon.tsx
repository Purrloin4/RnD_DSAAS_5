export const SmokerIcon = ({
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
      d="M.7,23c-.4,0-.7-.3-.7-.7,0-1,0-2,0-3.1,0-.4.3-.7.7-.7.2,0,.3,0,.5,0h22c0,0,.1,0,.2,0,.6,0,.7.4.7.7,0,1,0,2,0,3,0,.7-.5.8-.8.8H1s-.2-.3-.2-.3v.3h-.2ZM21,21.6c0-.3,0-.6,0-.8,0-.2,0-.9,0-.9,0,0-.3,0-.3,0,0,.2,0,.9,0,.9,0,0,0,.9,0,.9,0,0,.3,0,.3,0ZM19.3,21.6c0-.4,0-.8,0-1.2,0,0,0-.6,0-.6,0,0-16.3,0-16.3,0-.6,0-1.1,0-1.7,0,0,.4,0,.8,0,1.1,0,0,0,.6,0,.6,0,0,12.8,0,12.8,0,1.7,0,3.4,0,5.1,0ZM22.7,21.6c0-.2,0-1.7,0-1.7,0,0-.3,0-.3,0,0,.3,0,1.7,0,1.7,0,0,.3,0,.3,0Z"
    />
    <path
      fill="currentColor"
      d="M20.7,18.5c-.4,0-.6-.3-.6-.8,0,0,0-.4,0-.4,0,0,0-.6,0-.6h0s0-.2,0-.2c0-.4,0-.7-.1-1.1,0-.6-.8-1.1-1.4-1.1-.2,0-.3,0-.5,0-.4,0-.8,0-1.2,0-.4,0-.8,0-1.1,0-.6,0-1.1,0-1.6-.2-.8-.2-1.3-.6-1.7-1.2-.4-.6-.5-1.3-.2-2.1,0-.2.2-.4.3-.6h0c.2-.6.1-.9-.2-1.1-.4-.2-.9-.4-1.3-.5-.3-.1-.5-.2-.7-.2-.2,0-.4,0-.6-.2-.8-.3-1.5-.9-1.8-1.7-.3-.8-.2-1.7.3-2.4.3-.5.7-.9,1.1-1.2.2-.1.3-.2.5-.2s.4.1.5.3c.1.2.3.5-.2,1h-.1c-.3.4-.5.6-.7.9-.2.4-.3.8-.1,1.2.1.4.5.7.9.8.2,0,.5.1.7.2.4,0,.7.2,1,.3.5.2.9.4,1.2.6.9.6,1.1,1.6.6,2.6-.1.2-.2.4-.3.7-.1.5,0,1,.6,1.2.5.2,1,.3,1.7.3s.3,0,.5,0h.7c.5,0,1-.1,1.5-.1h0c.7,0,1.4.2,2,.7.6.5,1,1.2,1.1,2,0,.7,0,1.3,0,2v.3c0,.4-.3.7-.7.7h0Z"
    />
    <path
      fill="currentColor"
      d="M22.4,18.5c-.1,0-.2,0-.3,0-.3-.2-.4-.5-.3-.9l.2-.5c.2-.4.3-.8.5-1.3.3-1,.2-1.7-.4-2.2-.3-.3-.7-.5-1-.6-.2-.1-.5-.2-.8-.3-.3-.1-.6-.2-.9-.4-.8-.4-1.1-1.1-.9-1.9,0-.1,0-.3.1-.4.2-.5.2-.9,0-1.2-.2-.3-.5-.5-.9-.7,0,0-.2,0-.3,0,0,0-.2,0-.3,0-.4-.1-.6-.4-.5-.8,0-.3.3-.6.6-.6.9.1,2,.4,2.6,1.6.1.2.2.4.2.7,0,0,0,.4,0,.4v.4c-.2.3-.3.5-.4.8-.2.5-.1.7.4.9l.5.2c.4.1.7.3,1.1.4,1.7.8,2.5,2.2,2,4-.1.5-.3,1-.5,1.5,0,.2-.2.4-.3.7,0,0,0,.1,0,.1-.1.2-.4.4-.6.4Z"
    />
    <path
      fill="currentColor"
      d="M16.7,10.2c-.3,0-.6,0-.8-.2-1.1-.4-1.8-1.2-2.1-2.1-.3-.8-.2-1.6.3-2.3.1-.2.3-.4.4-.6l.2-.2c.3-.4.4-.8.3-1.2,0-.4-.3-.8-.7-1.1,0,0-.3-.2-.3-.2-.3-.2-.4-.5-.3-.8.1-.3.3-.4.6-.4s.2,0,.3,0c.3.1.6.3.8.5.7.6,1,1.4,1.1,2.4,0,.5-.2,1.1-.6,1.6,0,.1-.2.2-.3.3-.1.1-.2.3-.3.4-.4.5-.4,1,0,1.6.4.6.9.9,1.5,1h.2c.4.1.5.4.5.8,0,.4-.3.6-.6.6h0Z"
    />
    <path
      fill="currentColor"
      d="M21.7,10.2c-.2,0-.3,0-.5-.2-.2-.2-.4-.5,0-1,.3-.4.5-.7.8-1.1,0,0,0-.1,0-.2,0,0,0,0,0,0,0,0,0,0,0,0,0-.1-.1-.2-.2-.3-.1-.1-.3-.2-.5-.3-.1,0-.3-.2-.4-.3-.3-.2-.7-.5-.9-.7-.6-.7-.7-1.5-.3-2.4.2-.4.4-.7.7-1,.1-.2.4-.3.6-.3s.3,0,.4.2c.1.1.4.4,0,1-.3.4-.5.8-.6,1.1-.1.2,0,.4.1.5.2.2.5.4.8.6.1,0,.2.1.3.2.1,0,.2.1.3.2,1,.6,1.2,1.6.7,2.6-.2.4-.5.8-.8,1.2h0c-.2.3-.4.4-.6.4Z"
    />
  </svg>
);
