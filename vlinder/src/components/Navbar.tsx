import React from 'react'
import Link from "next/link";


export default function Navbar() {
  return (
    <nav>
        <h1>test</h1>
        <Link href={"/"}>Dashboard</Link>
        <Link href={"/login"}>Login</Link>
    </nav>
  )
}
