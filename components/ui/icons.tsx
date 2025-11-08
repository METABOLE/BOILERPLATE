import { forwardRef, SVGProps } from 'react';

export const IconSample = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ ...props }, ref) => (
    <svg {...props} ref={ref}>
      <path d="M.000" />
    </svg>
  ),
);
