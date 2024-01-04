'use client'

import { signOut, useSession } from 'next-auth/react';
import React, { useContext, useEffect } from 'react';
import { useRouter } from "next/navigation";
import {FiTruck} from 'react-icons/fi'
import { stateContext } from './Context/StateProvider';
import Image from 'next/image';
import logo from '../../public/RURUTEK - Logo Original.svg'

export default function Navbar(props) {3
  const session = useSession();
  const router = useRouter();
  const { showAddVehicle,setShowAddVehicle } = useContext(stateContext);
  useEffect(() => {
    if(session.status === 'unauthenticated'){
      if(window.location.pathname === '/')
      {router?.push("/login")}
    }
  },[session])
  return (
        <nav className='h-16 2xs:h-14 bg-blue-500 text-white sm:text-sm xs:text-xs 2xs:text-xs'>
          <div className='flex items-center justify-between h-full px-5'>
            <div>
                <Image src={logo} className='sm:w-24 xs:w-20 2xs:w-20'></Image>
            </div>
            <div className='flex gap-5 2xs:gap-2'>
                  {session.status === 'authenticated' ? <button className='hover:border-b' onClick={() => setShowAddVehicle(!showAddVehicle)}>Add Vehicle +</button> :  <p className='flex items-center gap-2 2xs:gap-1'><FiTruck></FiTruck> Ruru Tracking</p> }
                  {session.status === 'authenticated' && <button className='border p-2 rounded-md hover:bg-white hover:text-blue-800' onClick={() => signOut()}>Signout</button>}
            </div>
          </div>
        </nav>
  )
}
