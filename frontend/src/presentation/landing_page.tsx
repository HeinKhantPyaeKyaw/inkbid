import React from 'react'
import { NavbarPrimary } from './components/navbar/navbar_primary';

export const LandingPage = () => {
  //---------------------
  //   CONST
  //---------------------
    const title = 'Landing Page'

  //---------------------
  //   QUERY DATA
  //---------------------
    

  //---------------------
  //   RENDER
  //---------------------
  return (
    <div>
      <NavbarPrimary isDisableNoti={false} />
    </div>
  );
}