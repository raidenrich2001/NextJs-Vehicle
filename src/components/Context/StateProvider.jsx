'use client'
import React, { createContext, useState } from 'react'

export const stateContext = createContext()

export default function StateProvider({ children }) {
  const [showAddVehicle, setShowAddVehicle] = useState()
  return (
    <stateContext.Provider value={{showAddVehicle, setShowAddVehicle}}>
        { children }
    </stateContext.Provider>
  )
}
