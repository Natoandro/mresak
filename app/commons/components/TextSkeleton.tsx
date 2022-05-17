import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export interface TextSkeletonProps extends HTMLAttributes<HTMLDivElement> { }

export default function TextSkeleton({ className, ...props }: TextSkeletonProps) {
  return (
    <div className={clsx('bg-slate-400/40 rounded', className)} {...props} />
  );
}