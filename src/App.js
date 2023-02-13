import React from "react";
import Home from "./pages/home/Home";
import New from "./pages/new/New";
import {Routes, Route} from "react-router-dom";
import Auctions from "./pages/auctions/Auctions";
import Auction from "./pages/auction/Auction";
import AuctionView from "./pages/auctionView/AuctionView";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new/:model" element={<New />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auction/:auctionId" element={<Auction />} />
            <Route path="/auction/view/:auctionId" element={<AuctionView />} />
        </Routes>
    )
}

export default App;