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


export const TabButton = ({active,children,onClick}:{
  active : boolean,
  children : React.ReactNode,
  onClick : ()=>void
}) => {

  return <button type="button" onClick={onClick} className={ ` m-4 text-white rounded-xl bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium  leading-5 rounded-base  px-5 py-2.5 focus:outline-none  ${active ? 'bg-blue-500' : 'bg-blue-300'}`}>
 {children}   
    
    </button>
}