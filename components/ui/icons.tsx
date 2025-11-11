import { forwardRef, SVGProps } from 'react';

export const IconSample = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ ...props }, ref) => (
    <svg {...props} ref={ref} viewBox="0 0 24 24">
      <path d="M12 2L2 22h20L12 2z" fill="red" />
    </svg>
  ),
);
