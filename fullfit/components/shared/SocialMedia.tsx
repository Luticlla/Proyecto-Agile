"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { socialLinks } from '@/constants/social';

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipPosition?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />,
}

const SocialMedia = ({ className, iconClassName, tooltipPosition }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-10", className)}>
        {socialLinks.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <Link
                target='_blank'
                rel='noopener noreferrer'
                href={item.href}
                className={cn("p-2 border hover:text-white hover:border-black hoverEffect rounded-full", iconClassName)}>
                {iconMap[item.title]}
              </Link>
            </TooltipTrigger>
            <TooltipContent className={cn("bg-white text-black font-serif")}>{item.title}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
};

export default SocialMedia;
