import { SVGProps } from 'react';

export default function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="8" className="stroke-blue-500 fill-transparent" strokeWidth="2" />
      <g style={{ transformOrigin: '12px 12px', transform: 'rotate(-45deg)' }}>
        <rect
          x="10" y="20" width="4" height="5"
          className="fill-blue-500"
        />
      </g>
    </svg>
  );
}
