import React from "react";
import Home from "./pages/home/Home";
import New from "./pages/new/New";
import {Routes, Route} from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new/:model" element={<New />} />
        </Routes>
        
    )
}

export default App;