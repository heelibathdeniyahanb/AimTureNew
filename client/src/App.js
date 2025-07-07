import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../../client/src/Components/ThemeContext' // Import your ThemeProvider

import ProtectedRoute from './Components/Common/ProtectedRoute';


import UserDashboard from './Components/User/UserDashboard';
import MarketingDashboard from './Components/MarketingManager/MarketingDashboard';

import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/Common/LoginPage';
import RegisterPage from './Pages/User/RegisterPage';
import UserDashboardPage from './Pages/User/UserDashboardPage';
import UserContextProvider from './Components/UserContext';
import MyLearningPath from './Pages/User/MyLearningPath';
import UserProfilePage from './Pages/User/UserProfile';
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage';
import AdminProfile from './Pages/Admin/AdminProfile';
import Users from './Pages/Admin/Users';
import EmailComposer from './Pages/Common/Email';
import MarketingManagerDashboard from './Components/MarketingManager/MarketingDashboard';

import AllLearningPathsPage from './Pages/Admin/AllLearningPathsPage';
import MMDashboardPage from './Pages/MarketingManager/MMDashboardPage';
import MMProfile from './Pages/MarketingManager/MMProfile';
import Advertisemnets from './Components/MarketingManager/Advertisemnets';
import MMAdvertisement from './Pages/MarketingManager/MMAdvertisement';
import MMEmail from './Pages/MarketingManager/MMEmail';

function App() {
  return (
    <ThemeProvider> {/* Wrap your routes with ThemeProvider */}
   
      <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          
          <Route path='/admin/dashboard/page' element={<AdminDashboardPage />} />
          <Route path='/user/dashboard' element={<UserDashboardPage />} />
          <Route path='/learning/path' element={<MyLearningPath />} />
          <Route path='/user/profile' element={<UserProfilePage/>}></Route>
          
          <Route path='/marketing/dashboard' element={<MarketingDashboard />} />
          <Route path='/register-form' element={<RegisterPage />} />
          <Route path='/user/dashboard/page' element={<UserDashboardPage/> }></Route>
           <Route path='/admin/profile' element={<AdminProfile/>}></Route>
            <Route path='/users' element={<Users/>}></Route>
            <Route path='/email' element={<EmailComposer/>}></Route>
            <Route path='/admin/learning-paths' element={<AllLearningPathsPage/>} />
            <Route path='/marketingManagerDashboard' element={<MMDashboardPage/>}></Route>
            <Route path='/marketingManagerProfile' element={<MMProfile/>}></Route>
            <Route path='/advertisements' element={<MMAdvertisement/>}></Route>
            <Route path='/marketing/email' element={<MMEmail/>}></Route>
         
        
        
        </Routes>
        </UserContextProvider>
      </BrowserRouter>
     
    </ThemeProvider>
  );
}

export default App;
