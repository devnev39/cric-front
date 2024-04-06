import React from "react";
import "./styles.css";
import Footer from "../Footer";

const About = () => {
  return (
    <>
      <div className="row m-2">
        <div className="col-5 p-5 h3 lh-base">
          Cric is a revolutionary platform that puts you in control, allowing
          you to simulate, manage, and administer cricket auctions with ease.
          Optimized for the dynamic world of cricket, Cric gives you the tools
          to draft your dream team and strategize for victory.
        </div>
        <div className="col-7 d-flex justify-content-center align-items-center">
          <img className="img-class" alt="SS1" src="/ss1.png" />
        </div>
      </div>
      <div className="row m-2 mt-5">
        <div className="col-7 d-flex justify-content-center align-items-center">
          <img className="img-class" alt="SS2" src="/ss2.png" />
        </div>
        <div className="col-5 p-5 h3 lh-base">
          Cric empowers you to create custom rules that tailor team shortlisting
          to your exact specifications.
        </div>
      </div>
      <div className="row m-2 mt-5 d-flex justify-content-center">
        For any queries - dhruvbonde007@gmail.com
      </div>
      <Footer />
    </>
  );
};

export default About;
