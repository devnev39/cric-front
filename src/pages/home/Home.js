import React from "react"
import Headtop from "../../components/home/head-top"
import Headhome from "../../components/home/home-head"
import Headbottom from "../../components/home/head-bottom"
// import Head from "../../components/home/head-bottom"
import "./styles.css"

function Home() {
    return (
        <div className="home-container">
            <Headhome className="home-component"/>
            <Headtop className="home-component"/>
            <Headbottom className="home-component"/>
        </div>
    )   
}

export default Home;