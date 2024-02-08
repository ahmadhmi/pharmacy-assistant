import Link from "next/link";
import { ReactNode } from "react";
import { IconType } from "react-icons";

interface Props{
    href:string,
    className?:string,
    children?:ReactNode,
    Icon?:IconType,
    IconSize?:number
}

export default function LinkBlock({href, Icon, IconSize, className, children}: Props){

    return(
        <Link href={href}>
        <div className={className + " btn btn-primary flex flex-row justify-between items-center min-w-full"
    }>
            <p>{children}</p>
            {Icon? <Icon size={IconSize}></Icon> : <></>}
        </div>
      </Link>
    )

}