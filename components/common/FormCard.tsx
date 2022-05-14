import { PropsWithChildren } from 'react';

export default function FormCard({ children }: PropsWithChildren<{}>) {
  return (
    <div className="max-w-sm mx-auto my-10 p-4 border shadow-md rounded-xl">
      {children}
    </div>
  );
}
