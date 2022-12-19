// Home page

import React from "react"
import Hometop from "../../components/home/home-top"
import Homebottom from "../../components/home/home-bottom"
import "./styles.css"

function Home() {
    return (
        <div className="home-container">
            <Hometop className="home-component"/>
            <Homebottom className="home-component"/>
        </div>
    )   
}

export default Home;