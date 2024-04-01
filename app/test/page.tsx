"use client"

import { usePathname } from 'next/navigation'
import React from 'react'

const page = () => {

    const pathName = usePathname();
    console.log(pathName)
  return (
    <div>
    </div>
  )
}

export default page