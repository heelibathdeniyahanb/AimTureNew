import React from 'react'
import Advertisements from '../../Components/MarketingManager/Advertisemnets'
import SideBar from '../../Components/User/SideBar'
import Header from '../../Components/User/Header'
import MarketingSidebar from '../../Components/MarketingManager/MarketingManagerSidebar'

export default function MMAdvertisement() {
  return (
     <div className="min-h-screen bg-[#1e1e1e] flex">
      <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
        <MarketingSidebar />
      </div>

      <div className="flex-grow ml-[250px]">
        <Header />
       <Advertisements/>
      </div>

    </div>
  )
}
