"use client";
import React, { EffectCallback, useEffect } from "react";
import axios from "axios";
import { Block } from "@/interfaces/block";

interface Props{
    params:{
        blockId:string
    }
}

export default function BlockPage({params}:Props){


    return(
        <section>
            {params.blockId}
        </section>
    )
}