/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import './styles.css';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBFooter,
  MDBIcon,
  MDBRow,
} from 'mdb-react-ui-kit';
import {animated, useInView, useSpring} from '@react-spring/web';

const Home = () => {
  const createSprings = (number) => {
    const springs = [];
    const props = [];
    for (let i = 0; i < number; i++) {
      const [spring, prop] = useSpring(() => ({from: {x: 1}}));
      springs.push(spring);
      props.push(prop);
    }
    return [springs, props];
  };

  const [springs, props] = createSprings(4);

  const expandOnHover = (cardNumber) => {
    props[cardNumber].start({
      from: {x: 1},
      to: {x: 1.1},
    });
  };

  const shrinkAfterHover = (cardNumber) => {
    props[cardNumber].start({
      from: {x: 1.1},
      to: {x: 1},
    });
  };

  const [propsA] = useSpring(() => ({
    from: {opacity: 0, transform: 'translateY(-50px)'},
    to: {opacity: 1, transform: 'translateY(0px)'},
    delay: 500,
  }));
  const [propsB] = useSpring(() => ({
    from: {opacity: 0, transform: 'translateY(-50px)'},
    to: {opacity: 1, transform: 'translateY(0px)'},
    delay: 1000,
  }));
  const [propsC] = useSpring(() => ({
    from: {opacity: 0, transform: 'translateY(-50px)'},
    to: {opacity: 1, transform: 'translateY(0px)'},
    delay: 1500,
  }));

  const [propsD] = useSpring(() => ({
    from: {opacity: 0, transform: 'translateY(50px)'},
    to: {opacity: 1, transform: 'translateY(0px)'},
    delay: 1800,
  }));

  const [midDivRefA, springsA] = useInView(
      () => ({
        from: {transform: 'translateY(-100px)'},
        to: {transform: 'translateY(0px)'},
        config: {tension: 280, friction: 60},
      }),
      {rootMargin: '-20%', once: true},
  );

  const [midDivRefB, springsB] = useInView(
      () => ({
        from: {transform: 'translateY(50px)', opacity: 0},
        to: {transform: 'translateY(0px)', opacity: 1},
        config: {tension: 280, friction: 60},
      }),
      {rootMargin: '-10%', once: true},
  );

  const [cardARef, springCardA] = useInView(
      () => ({
        from: {transform: 'translateY(-100px)'},
        to: {transform: 'translateY(0px)'},
        config: {tension: 280, friction: 60},
      }),
      {rootMargin: '-20%', once: true},
  );

  const [cardDRef, springCardD] = useInView(
      () => ({
        from: {transform: 'translateY(70px)'},
        to: {transform: 'translateY(0px)'},
        config: {tension: 280, friction: 60},
      }),
      {rootMargin: '-20%', once: true},
  );

  return (
    <>
      <div id="hometop" className="bg-image background shadow-2-strong">
        <div className="mask" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="offset">
            <MDBContainer>
              <MDBRow>
                <MDBCol md={6} className="heading-first">
                  <div className="d-flex justify-content-start gap-2 text-capitalise">
                    <animated.div style={propsA} className="fs-1 text-danger">
                      Outbid,
                    </animated.div>
                    <animated.div style={propsB} className="fs-1 text-info">
                      Outplay,
                    </animated.div>
                    <animated.div style={propsC} className="fs-1 text-success">
                      Outlast !
                    </animated.div>
                  </div>
                  <animated.div
                    style={propsD}
                    className="fs-4 font-monospace text-light fw-normal"
                  >
                    Where Strategy Meets Mettle. Can You Outbid, Outplay,
                    Outlast and Build Your Dream Team?
                  </animated.div>
                  <div className="col-12 top-buttons mt-5 d-flex justify-contents-start gap-5">
                    <MDBBtn size="lg" rounded color="success">
                      Create new auction
                    </MDBBtn>
                    <MDBBtn size="lg" outline rounded color="danger">
                      Continue auction
                    </MDBBtn>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-center home-mid w-100"
        id="mid-container"
      >
        <MDBContainer>
          <MDBRow around>
            <MDBCol md={6}>
              <animated.div
                ref={midDivRefA}
                style={springsA}
                className="display-4 text-danger"
              >
                From established stars to rising talents, all vying for your
                bid.
              </animated.div>
              <animated.div
                ref={midDivRefB}
                style={springsB}
                className="fs-5 text-dark mt-3"
              >
                Don't just build a team, build a cricketing dynasty. The future
                of cricket is at your fingertips. Unearth hidden gems or secure
                proven champions. The choice is yours with our extensive player
                database
              </animated.div>
            </MDBCol>
            <MDBCol md={5}>
              <MDBContainer>
                <MDBRow className="my-3">
                  <MDBCol>
                    <animated.div
                      ref={cardARef}
                      style={springCardA}
                      onMouseEnter={() => expandOnHover(0)}
                      onMouseLeave={() => shrinkAfterHover(0)}
                    >
                      <animated.div
                        style={{
                          transform: springs[0].x.to(
                              (value) => `scale(${value})`,
                          ),
                        }}
                      >
                        <MDBCard alignment="center">
                          <MDBCardBody>
                            <div className="display-4 text-success">200+</div>
                            <div className="fs-4">Players</div>
                          </MDBCardBody>
                        </MDBCard>
                      </animated.div>
                    </animated.div>
                  </MDBCol>
                  <MDBCol>
                    <animated.div
                      style={{...springCardA}}
                      onMouseEnter={() => expandOnHover(1)}
                      onMouseLeave={() => shrinkAfterHover(1)}
                    >
                      <animated.div
                        style={{
                          transform: springs[1].x.to(
                              (value) => `scale(${value})`,
                          ),
                        }}
                      >
                        <MDBCard alignment="center">
                          <MDBCardBody>
                            <div className="display-4 text-success">5+</div>
                            <div className="fs-4">Countries</div>
                          </MDBCardBody>
                        </MDBCard>
                      </animated.div>
                    </animated.div>
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <animated.div
                      style={springCardD}
                      ref={cardDRef}
                      onMouseEnter={() => expandOnHover(2)}
                      onMouseLeave={() => shrinkAfterHover(2)}
                    >
                      <animated.div
                        style={{
                          transform: springs[2].x.to(
                              (value) => `scale(${value})`,
                          ),
                        }}
                      >
                        <MDBCard alignment="center">
                          <MDBCardBody>
                            <div className="display-4 text-success">150+</div>
                            <div className="fs-4">Indian Players</div>
                          </MDBCardBody>
                        </MDBCard>
                      </animated.div>
                    </animated.div>
                  </MDBCol>
                  <MDBCol>
                    <animated.div
                      style={springCardD}
                      onMouseEnter={() => expandOnHover(3)}
                      onMouseLeave={() => shrinkAfterHover(3)}
                    >
                      <animated.div
                        style={{
                          transform: springs[3].x.to(
                              (value) => `scale(${value})`,
                          ),
                        }}
                      >
                        <MDBCard alignment="center">
                          <MDBCardBody>
                            <div className="display-4 text-success">80+</div>
                            <div className="fs-4">Outseas Players</div>
                          </MDBCardBody>
                        </MDBCard>
                      </animated.div>
                    </animated.div>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        {/* <div className='row d-flex justify-content-center w-100'>
          <div className='col-6'>
            <div className='display-4 text-dark'>
              From established stars to rising talents, all vying for your bid.
            </div>
            <div className='fs-5 text-dark mt-3'>
              Don't just build a team, build a cricketing dynasty. The future of cricket is at your fingertips. Unearth hidden gems or secure proven champions. The choice is yours with our extensive player database
            </div>
          </div>
          <div className='col-5 text-dark'>
            <div className='row d-flex justify-content-center w-100 gap-5'>
              <div className='col-4'>
              </div>
              <div className='col-4'>
                <MDBCard alignment='center'>
                  <MDBCardBody>
                    <div className='fs-2'>123</div>
                    <div className='fs-4'>Something !</div>
                  </MDBCardBody>
                </MDBCard>
              </div>
            </div>
            <div className='row d-flex justify-content-center w-100 gap-5 mt-5'>
              <div className='col-4'>
                <MDBCard alignment='center'>
                  <MDBCardBody>
                    <div className='fs-2'>123</div>
                    <div className='fs-4'>Something !</div>
                  </MDBCardBody>
                </MDBCard>
              </div>
              <div className='col-4'>
                <MDBCard alignment='center'>
                  <MDBCardBody>
                    <div className='fs-2'>123</div>
                    <div className='fs-4'>Something !</div>
                  </MDBCardBody>
                </MDBCard>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <MDBFooter
        bgColor="light"
        className="text-center text-lg-start text-muted"
      >
        <section className="d-flex justify-content-center p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with us on social networks:</span>
          </div>
          <div className="d-flex">
            <a href="" className="me-4 text-reset">
              <MDBIcon fab icon="linkedin" />
            </a>
            <a href="" className="me-4 text-reset">
              <MDBIcon fab icon="github" />
            </a>
          </div>
        </section>

        <section className="">
          <MDBContainer className="text-center text-md-start mt-5">
            <MDBRow className="mt-3">
              <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <MDBIcon icon="gem" className="me-3" />
                  DEVNEV
                </h6>
              </MDBCol>

              <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Products</h6>
                <p>
                  <a href="#!" className="text-reset">
                    Cric Auction
                  </a>
                </p>
              </MDBCol>

              <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
                <p>
                  <a href="#!" className="text-reset">
                    Pricing
                  </a>
                </p>
                <p>
                  <a href="#!" className="text-reset">
                    Players
                  </a>
                </p>
                <p>
                  <a href="#!" className="text-reset">
                    About
                  </a>
                </p>
                <p>
                  <a href="#!" className="text-reset">
                    Help
                  </a>
                </p>
              </MDBCol>

              <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                <p>
                  <MDBIcon icon="envelope" className="me-3" />
                  info@example.com
                </p>
                <p>
                  <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
                </p>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
        <div
          className="text-center p-4"
          style={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
        >
          © 2021 Copyright :
          <a
            className="text-reset fw-bold ms-2"
            href="https://mdbootstrap.com/"
          >
            DevNev
          </a>
        </div>
      </MDBFooter>
    </>
  );
};

export default Home;
