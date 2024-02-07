"use client"; 
import React, { ReactNode, useEffect } from 'react';
import {SessionProvider} from 'next-auth/react';
import { redirect, RedirectType, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';


export default function AuthProvider({children} : {children:ReactNode}){

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}