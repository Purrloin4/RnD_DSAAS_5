"use client";
import { login } from '@/src/app/login/actions';
import { Button, Input, Link } from "@nextui-org/react";
import Logo from "Components/Logo/Logo";
import React, { useState } from "react";
import {EyeFilledIcon} from "Components/Icons/EyeFilledIcon";
import {EyeSlashFilledIcon} from "Components/Icons/EyeSlashFilledIcon";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
export default function Reset() {
  const router = useRouter();
 const supabase = createClient(); 
const [data, setData] = useState<{
  password:string,
   confirmPassword:string}>({
    
    password:'',
    confirmPassword:''});
   
const confirmPasswords = async () => {
  const{password,confirmPassword} = data;
  if(password !== confirmPassword)return alert('Passwords do not match');
   const{data:resetData,error} = await supabase.auth.updateUser({password:data.password});
  if(resetData){
router.push('/');
  }
if(error) console.log(error);
}


 const handleChange = (e: any)=>{
const {name,value} = e.target;
setData((prev:any)=>({
  ...prev,
  [name]:value,}));}



return(
<div className='container mx-auto w-[400px] grid gap-4'>
<div className='grid'>
  <label>Enter your new password</label>
<input type='password' name = 'password' value = {data?.password} onChange={handleChange} />

</div>

<div className='grid'>
  <label>Confirm your new password</label>
<input type='password' name = 'confirmPassword' value = {data?.confirmPassword} onChange={handleChange} />
</div>

<div>
<button className='px-4 py-2 bg-blue-500 rounded cursor-pointer' onClick={confirmPasswords}>
  Confirm
  </button>   
  </div>


</div>
);}

