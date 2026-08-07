"use client";
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import {PrimaryButton} from './Button';
import { Logo } from './Logo';

function Header() {
    const session = useSession();
  return (
    <div className=' px-2 py-2 flex justify-between'>
        <Logo/>

        <div className=''>
          {session.data?.user? <PrimaryButton onClick={()=>{
            signOut()
          }}   >  Logout </PrimaryButton> : <PrimaryButton onClick={()=>{
            signIn()
          }}   >  Sign In </PrimaryButton>}
        </div>
    </div>
  )
}

export default Header