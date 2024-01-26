// Home page

import React from 'react';
import Hometop from '../../components/home/home-top';
import Homebottom from '../../components/home/home-bottom';
import './styles.css';

const Home = () => {
  return (
    <>
      <div className="home-container blurBackground" id="mainHomeContainer">
        <Hometop className="home-component"/>
        <Homebottom className="home-component"/>
      </div>
      <div className="loadingScreen position-absolute p-3 top-50 start-50 translate-middle shadow bg-white rounded display openForm openFormDisplay h1" id="loadingScreen">
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success" style={{'width': '5rem', 'height': '5rem'}} role="status">
            <span className="sr-only"></span>
          </div>
        </div>
            Loading.....Please wait !
      </div>
    </>
  );
};

export default Home;
