"use client";
import React from 'react'

export function PrimaryButton({children,onClick}:{
    children : React.ReactNode,
    onClick : ()=>void
}) {
  return <button onClick={onClick} type="button" className="text-white bg-black rounded-xl py-3 px-5">  {children}  </button>
}

export function SecondaryButton({children,onClick,prefix}:{
    children : React.ReactNode,
    onClick : ()=>void
    prefix? : React.ReactNode
}) {
  return <button onClick={onClick}  className="text-white bg-blue-400 font-semibold rounded-xl py-3 px-5">  
  {prefix}
  {children}
    </button>
}
