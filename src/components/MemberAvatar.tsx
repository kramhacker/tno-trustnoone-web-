import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface MemberAvatarProps {
  src: string;
  name: string;
  className?: string;
  iconSize?: number;
  eager?: boolean;
}

export function MemberAvatar({
  src,
  name,
  className = 'w-20 h-20 rounded-xl',
  iconSize = 24,
  eager = false,
}: MemberAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  if (!src || hasError) {
    return (
      <div
        className={`${className} bg-[#1A1A22] border border-[#2A2A35] flex flex-col items-center justify-center text-[#9E9EA9] select-none overflow-hidden shrink-0`}
        aria-label={`Portrait of ${name}`}
      >
        {initials ? (
          <span className="font-display font-semibold text-lg tracking-tight text-[#F4F4F6]">
            {initials}
          </span>
        ) : (
          <User size={iconSize} className="text-[#9E9EA9]" aria-hidden="true" />
        )}
      </div>
    );
  }

  return (
    <div className={`${className} bg-[#16161C] overflow-hidden shrink-0`}>
      <img
        src={src}
        alt={`Profile picture of ${name}`}
        referrerPolicy="no-referrer"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}
