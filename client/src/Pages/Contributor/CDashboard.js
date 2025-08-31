import React from 'react'
import ContributorSideBar from '../../Components/Contributor/ContributorSidebar'
import Header from '../../Components/User/Header'

export default function CDashboard() {
  return (
   <div className="min-h-screen bg-[#1e1e1e] flex">
      <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
       <ContributorSideBar/>
      </div>

      <div className="flex-grow ml-[250px]">
        <Header />
        {/* <MarketingManagerDashboard/> */}
      </div>

    </div>
  )
}
