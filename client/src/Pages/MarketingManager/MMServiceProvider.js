import React from 'react';
import MarketingSidebar from '../../Components/MarketingManager/MarketingManagerSidebar';
import Header from '../../Components/User/Header';
import AdvertisemntProvider from '../../Components/MarketingManager/AdvertismentProvider';

export default function MMServiceProvider() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
        <MarketingSidebar />
      </div>

      <div className="flex-grow ml-[260px]">
             <Header />
             <AdvertisemntProvider/>
      </div>
    </div>
  );
}
