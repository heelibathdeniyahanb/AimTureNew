import React from 'react'
import MarketingSidebar from '../../Components/MarketingManager/MarketingManagerSidebar'
import Header from '../../Components/User/Header'
import MarketingManagerDashboard from '../../Components/MarketingManager/MarketingDashboard'


export default function MMDashboardPage() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] flex">
      <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
       <MarketingSidebar/>
      </div>

      <div className="flex-grow ml-[250px]">
        <Header />
        <MarketingManagerDashboard/>
      </div>

    </div>
  )
}
