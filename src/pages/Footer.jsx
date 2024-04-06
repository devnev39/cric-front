import React from "react";
import { MDBFooter, MDBIcon } from "mdb-react-ui-kit";

export default function Footer() {
  return (
    <MDBFooter
      bgColor="light"
      className="text-center mt-3 text-lg-start text-muted"
    >
      <div
        className="d-flex justify-content-evenly align-items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        <div className="text-center p-4">
          Developed and managed by
          <a
            className="text-reset fw-bold ms-2"
            href="https://mdbootstrap.com/"
          >
            @DevNev
          </a>
        </div>
        <div className="d-flex">
          <a
            href="https://www.linkedin.com/in/bhuvanesh-bonde-58793615b"
            className="me-4 text-reset"
          >
            <MDBIcon size="2x" fab icon="linkedin" />
          </a>
          <a href="https://www.github.com/devnev39" className="me-4 text-reset">
            <MDBIcon size="2x" fab icon="github" />
          </a>
        </div>
      </div>
    </MDBFooter>
  );
}
