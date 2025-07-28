import { Metadata } from 'next';
import { auth, signIn } from "@/auth";
import React from 'react'

export const metadata: Metadata= {
  title: "Signin | Lelib",
};

const signInPage = async () => {
  const session = await auth()
  return (
    <div>signInPage</div>
  )
}

export default signInPage