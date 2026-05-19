"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {Facebook, Instagram} from 'lucide-react';
import Link from 'next/link';
interface Props{
    className?:string;
    iconClassName?:string;
    tooltipPosition?:string;
}
const SocialLink = [
{   title:"Facebook",
    href:"https://www.facebook.com/GimnasioFullForma/?locale=es_LA&_rdc=1&_rdr",
    icon:<Facebook className="w-5 h-5"/>,},
{   title:"Instagram",
    href:"https://www.instagram.com/fullformaoficial/?hl=es-la",
    icon:<Instagram className="w-5 h-5"/>,},
];

const SocialMedia = ({className,iconClassName,tooltipPosition}:Props) => {
 return (
     <TooltipProvider>
    <div className={cn("flex items-center gap-10",className)}>
        {SocialLink?.map((item)=>(
        <Tooltip key={item?.title}>
              <TooltipTrigger asChild>
                <Link key={item?.title} 
                target='_blank'
                rel='noopener noreferrer'
                href={item?.href}
                className={cn("p-2 border hover:text-white hover:border-black hoverEffect rounded-full",iconClassName)}>
                {item?.icon} 
                </Link>
              </TooltipTrigger>
              <TooltipContent className={cn("bg-white text-black font-serif")}>{item?.title}</TooltipContent>


        </Tooltip>



    ))}



         
    </div>
 </TooltipProvider>   
 )
};
export default SocialMedia;