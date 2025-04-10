import * as AvatarPrimitives from '@radix-ui/react-avatar';
import type {ReactNode} from 'react';

import {cn} from '@/utils';

export default function Avatar({
  fallbackIcon,
  src,
  alt,
  className,
  fallbackClassName,
}: {
  src?: string;
  alt?: string;
  fallbackIcon?: ReactNode;
  className?: string;
  fallbackClassName?: string;
}) {
  return (
    <AvatarPrimitives.Root
      className={cn('bg-muted size-10 rounded-full border', className)}
    >
      <AvatarPrimitives.Image src={src} alt={alt} />
      <AvatarPrimitives.Fallback
        className={cn(
          'text-muted-foreground flex h-full w-full items-center justify-center [&_svg]:size-6',
          fallbackClassName,
        )}
      >
        {fallbackIcon}
      </AvatarPrimitives.Fallback>
    </AvatarPrimitives.Root>
  );
}
