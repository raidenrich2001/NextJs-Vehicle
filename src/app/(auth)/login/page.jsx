'use client'
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import BeatLoader from "react-spinners/BeatLoader";

export default function login() {
  const session = useSession();
  const router = useRouter();
  const [error, setError] = useState();

  useEffect(() => {
    if(session.status === 'authenticated'){
      router?.push("/dashboard")
    }
  },[session,router])
 
  if (!session) {
    return (
      <div className="flex justify-center">
        <BeatLoader color="#3b82f6" />
      </div>
    );
  }

  const handleSubmit = async (e) =>{
      e.preventDefault();
      const username = e.target[0].value;
      const password = e.target[1].value;
      try {
        const response = await signIn('credentials', {username, password, redirect: false});
        if (response.error) {
          setError(response.error);
        }
      } catch (error) {
        setError(error.message);
      }
  }

  console.log(router)
  return (
    <div className='flex justify-center items-center h-full xl:flex-row lg:flex-row md:flex-row sm:flex-col-reverse xs:flex-col-reverse 2xs:flex-col-reverse'>
        <section className='flex-1'>
      <form className="flex gap-8 sm:gap-6 xs:gap-5 2xs:gap-5 text-sm flex-col xs:text-xs 2xs:text-xs p-10 rounded-md w-3/5 sm:w-full xs:w-full 2xs:w-full shadow-lg mx-auto bg-white" onSubmit={handleSubmit}>
        <div className='flex justify-between items-center'>
            <p className="text-lg sm:text-sm xs:text-sm 2xs:text-sm font-semibold text-blue-800">Login to continue</p>
            <small className='text-red-500 text-sm'>{error && error}</small>
        </div>
         
              <div>
                  <label>Username</label>
                  <br></br>
                  <input type='text' className="py-2 px-2 w-full border  border-blue-300 mt-2"></input>
              </div>
              <div>
                  <label>Password</label>
                  <br></br>
                  <input type='password' className="py-2 px-2 w-full border border-blue-300  mt-2"></input>
              </div>
              <div className="flex justify-between items-center">
                <Link href='/register' className="text-blue-600 hover:text-blue-700">New Register?</Link>
                <button type="submit" className="p-2 px-5 rounded bg-blue-600 text-white">Login</button>
              </div>
          </form>
      </section>
      <section className='flex-1'>
        <div className='relative h-[600px] 2xs:h-[300px] w-full sm:w-[300px] xs:w-[300px] 2xs:w-[300px]'>
            <Image src='/hero.svg' alt='hero' className='absolute' fill={true}></Image>
        </div>
      </section>
    
         
    </div>
  )
}
