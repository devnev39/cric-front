import settings from '../../config/settings';
import React, {useEffect, useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import fetchData from '../../helpers/fetchData';
import BarChart from '../common/BarChart';
import './styles.css';
import QueryBuiler from '../../helpers/queryBuilder';

export default function Homebottom() {
  const [tb1Data, setTb1Data] = useState(null);
  const [tb2Data, setTb2Data] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [timer, setTimer] = useState(null);

  const requestHomeData = async () => {
    const query = new QueryBuiler();

    let res = await fetchData(`${settings.BaseUrl}/player/query`, {
      query: query.sort({BasePrice: -1}).limit(5).queries,
    });
    if (res.status !== 200) {
      alert(`${res.status} ${res.data}`);
    } else {
      setTb1Data(res.data);
    }

    res = await fetchData(`${settings.BaseUrl}/player/query`, {
      query: query
          .clear()
          .group({_id: '$IPL2022Team', TotalBid: {$sum: '$AuctionedPrice'}})
          .project({_id: 0, Name: '$_id', TotalBid: '$TotalBid'})
          .sort({TotalBid: -1})
          .limit(5).queries,
    });
    if (res.status !== 200) {
      alert(`${res.status} ${res.data}`);
    } else {
      setTb2Data(res.data);
    }
  };
  useEffect(() => {
    const requestData = async () => {
      await requestHomeData();
    };
    const timer = setInterval(async () => {
      await requestData();
    }, 1000);
    setTimer(timer);
  }, []);

  useEffect(() => {
    if (tb1Data && tb2Data && !pageLoaded) {
      clearInterval(timer);
      toogleLoader('loadingScreen');
      setPageLoaded(true);
    }
  }, [tb1Data, tb2Data]);

  const toogleLoader = (formId) => {
    const e = document.getElementById(formId);
    if (e.classList.contains('display')) {
      e.classList.toggle('display');
      e.classList.toggle('openForm');
      e.classList.toggle('closeForm');
      e.classList.toggle('openFormDisplay');
      setTimeout(() => {
        e.classList.toggle('closeFormDisplay');
      }, 500);
      document
          .getElementById('mainHomeContainer')
          .classList.toggle('blurBackground');
    } else {
      e.classList.toggle('display');
      e.classList.toggle('closeForm');
      e.classList.toggle('openFormDisplay');
      e.classList.toggle('closeFormDisplay');
      setTimeout(() => {
        e.classList.toggle('openForm');
      }, 100);
      document
          .getElementById('mainHomeContainer')
          .classList.toggle('blurBackground');
    }
  };

  const tb1 = {
    BasePrice: Number,
    Country: String,
    PlayingRole: String,
  };

  const opt1 = {
    xkey: 'Name',
    ykey: 'BasePrice',
    xlabel: 'Players',
    ylabel: 'Base Price (in lakhs)',
    label: 'Base Price',
    tooltipInfoKeys: Object.keys(tb1),
  };

  const opt2 = {
    indexAxis: 'y',
    xlabel: 'Total bid (in lakhs)',
    ylabel: 'Team',
    xkey: 'Name',
    ykey: 'TotalBid',
    label: 'Total Bid',
    // tooltipInfoKeys : Object.keys(tb2)
  };

  return (
    <>
      <div className="home-bottom-div pt-5 pl-2">
        <Row>
          <Col xs={6} className="border-dark border-right">
            <div className="stat-head-1 d-flex justify-content-center">
              <h2>Player stats</h2>
            </div>
            <div className="stat-head d-flex justify-content-center my-3">
              <h3>Top 5 players with high base price</h3>
            </div>
            <div className="d-flex justify-content-center shadow-lg p-3 mb-5 bg-white rounded">
              {tb1Data ? <BarChart data={tb1Data} option={opt1} /> : null}
            </div>
          </Col>
          <Col xs={6}>
            <div className="stat-head-1 d-flex justify-content-center">
              <h2>IPL 2022 stats</h2>
            </div>
            <div className="stat-head d-flex justify-content-center my-3">
              <h3>Top teams with high biddings</h3>
            </div>
            <div className="justify-content-center shadow-lg p-3 mb-5 bg-white rounded">
              {tb2Data ? <BarChart data={tb2Data} option={opt2} /> : null}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
