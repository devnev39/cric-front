import React from 'react';
import Home from './pages/home/Home';
import Admin from './pages/admin/Admin';
import New from './pages/new/New';
import {Routes, Route} from 'react-router-dom';
import Auctions from './pages/auctions/Auctions';
import Auction from './pages/auction/Auction';
import AuctionView from './pages/auctionView/AuctionView';
import Team from './pages/team/Team';
import AdminView from './pages/admin/AdminView';
import About from './pages/about/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new/:model" element={<New />} />
      <Route path="/auctions" element={<Auctions />} />
      <Route path="/auction/:auctionId" element={<Auction />} />
      <Route path="/auction/view/:auctionId" element={<AuctionView />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/team" element={<Team />} />
      <Route path="/view/admin" element={<AdminView />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
