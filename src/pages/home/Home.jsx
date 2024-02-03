import React from 'react';
import './styles.css';
import {MDBBtn} from 'mdb-react-ui-kit';

const Home = () => {
  return (
    <>
      <div id="hometop" className="bg-image background shadow-2-strong">
        <div className="mask" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="offset">
            <div className="row heading-first">
              <div className="col-5 d-flex justify-content-start gap-2 text-capitalise">
                <div className="fs-1 text-danger">Outbid,</div>
                <div className="fs-1 text-info">Outplay,</div>
                <div className="fs-1 text-success">Outlast !</div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="fs-3 top-sentence fw-normal">
                  Where Strategy Meets Mettle. Can You Outbid, Outplay, Outlast
                  and Build Your Dream Team?
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-5 top-buttons mt-5 d-flex justify-contents-start gap-5">
                <MDBBtn size="lg" rounded color="success">
                  Create new auction
                </MDBBtn>
                <MDBBtn size="lg" outline rounded color="danger">
                  Continue auction
                </MDBBtn>
              </div>
            </div>
            {/* <div className='d-flex justify-content-around w-100 heading-first'>
              <div className='d-flex justify-content-center gap-2'>
                <div className='fs-1 text-danger'>
                  Outbid,
                </div>
                <div className='fs-1 text-info'>
                  Outplay,
                </div>
                <div className='fs-1 text-success'>
                  Outlast !
                </div>
              </div>
              <div></div>
            </div> */}
            {/* <div className='d-flex justify-content-around w-100'>
              <div className='fs-3 top-sentence'>
                Where Strategy Meets Mettle. Can You Outbid, Outplay, Outlast and Build Your Dream Team?
              </div>
              <div></div>
            </div> */}
          </div>
        </div>
      </div>
      {/* <div className="home-container blurBackground" id="mainHomeContainer">
        <Hometop className="home-component"/>
        <Homebottom className="home-component"/>
      </div> */}
      {/* <div className="loadingScreen position-absolute p-3 top-50 start-50 translate-middle shadow bg-white rounded display openForm openFormDisplay h1" id="loadingScreen">
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success" style={{'width': '5rem', 'height': '5rem'}} role="status">
            <span className="sr-only"></span>
          </div>
        </div>
            Loading.....Please wait !
      </div> */}
    </>
  );
};

export default Home;
