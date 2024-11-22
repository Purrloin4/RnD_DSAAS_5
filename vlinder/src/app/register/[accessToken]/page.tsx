"use client"
import { redirect, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react';

//Next-ui components
import { Input, Link, Button } from "@nextui-org/react";


//Components
import Logo from '@/src/components/Logo/Logo'


//Functions


//Page
function Page({params,}: {params: Promise<{ accessToken: string }>}) 
{
    //Variabels
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchAccessToken = async () => {
            const { accessToken } = await params; // Resolve the promise
            setAccessToken(accessToken); // Set the resolved token in state
        };
        fetchAccessToken();
    }, [params]);

    //Validators
    /*const validateAccessToken = (token : unknown) : boolean => typeof token === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
    const isInvalAccessToken = useMemo(() => {
        if (accessToken === "") return false;
    
        return validateAccessToken(accessToken) ? false : true;
      }, [accessToken]);*/

    //-----------
    //if (accessToken == null || !valid) redirect("/register")
    
    return (
        
    );
}

export default Page