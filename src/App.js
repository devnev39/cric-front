import React from "react";
import Home from "./pages/home/Home";
import New from "./pages/new/New";
import {Routes, Route} from "react-router-dom";
import Auctions from "./pages/auctions/Auctions";
import Auction from "./pages/auction/Auction";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new/:model" element={<New />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auction/:auctionId" element={<Auction />} />
        </Routes>
    )
}

export default App;