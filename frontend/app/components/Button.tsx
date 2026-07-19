"use client";
import React from 'react'

function PrimaryButton({children,onClick}:{
    children : React.ReactNode,
    onClick : ()=>void
}) {
  return <button onClick={onClick} type="button" className="text-white bg-black rounded-xl py-3 px-5">  {children}  </button>
}

export default PrimaryButton