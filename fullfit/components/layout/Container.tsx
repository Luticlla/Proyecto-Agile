import { cn } from '@/lib/utils'

const Container = ({
  children,
  className}: {
                children?:React.ReactNode;
                className?:string}) =>  {
  return (
    <div className={cn("max-w-screen-xl mx-auto px-3",className)}>{children}</div>
  )
}

export default Container