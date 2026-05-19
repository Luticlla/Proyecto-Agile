"use client"
import HamburgerIcon from 'hamburger-react';
import React, { useState } from 'react';
import SideMenu from './SideMenu';

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {/* En lugar de className, hamburger-react usa la propiedad color */}
        <HamburgerIcon 
          color="#fff" 
          toggled={isSidebarOpen} 
          toggle={setIsSidebarOpen} 
        />
      </button>
      
      <div>
        <SideMenu 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>
    </>
  )
}

export default MobileMenu;
