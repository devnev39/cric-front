import settings from '../../config/settings';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import BidConsole from '../../components/auctionView/BidConsole';
import LineBarChart from '../../components/common/LineBarChart';
import './styles.css';

const AuctionView = () => {
  const {auctionId} = useParams();
  const [auctionData, setAuctionData] = useState(null);
  const [countryCodes, setCountryCodes] = useState(null);
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [prevPlayer, setPrevPlayer] = useState(null);
  const [pooledPlayerDataset, setPooledPlayerDatset] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [flag, setFlag] = useState(false);
  const chartOption = {
    aspectRatio: 0.8,
    indexAxis: 'y',
    xkey: 'Name',
    ylinekey: 'Budget',
    ybarkey: 'Current',
    ylinelabel: 'MaxBudget',
    ybarlabel: 'Current Bal.',
    xlabel: 'Name',
    chartTitle: 'Team Budget Overview',
    chartTitlePosition: 'top',
    chartTitleSize: 20,
  };

  const fetchCountryCodes = async () => {
    let data = await (await fetch('https://flagcdn.com/en/codes.json')).json();
    if (!data) {
      return;
    }
    data = Object.entries(data).map(([key, val]) => [val, key]);
    data = Object.fromEntries(data);
    console.log(data);
    setCountryCodes(data);
  };

  const fetchAuctionData = async () => {
    const response = await (
      await fetch(`${settings.BaseUrl}/auction/${auctionId}`, {
        credentials: 'include',
      })
    ).json();
    if (response.status !== 200) {
      alert(response.data);
      if (response.status > 500 && response.status < 600) {
        navigate(-1);
      }
    } else {
      setAuctionData(response.data);
    }
  };

  useEffect(() => {
    const ele = document.getElementById('mainNavBar');
    ele.style.display = 'none';

    const run = async () => {
      await fetchAuctionData();
      await fetchCountryCodes();
    };
    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      await fetchAuctionData();
    };
    run();
  }, [flag]);

  useEffect(() => {
    if (!auctionData) {
      return;
    }
    setPooledPlayerDatset(
      auctionData.poolingMethod === 'Composite' ?
        auctionData.dPlayers.concat(auctionData.Add) :
        auctionData.cPlayers.concat(auctionData.Add),
    );
    setChartData(auctionData.Teams);
  }, [auctionData]);

  useEffect(() => {
    if (!currentPlayer) {
      setCurrentPlayer(pooledPlayerDataset ? pooledPlayerDataset[0] : null);
    } else {
      setCurrentPlayer((player) => {
        return _.find(pooledPlayerDataset, (p) => p._id === player._id);
      });
    }
  }, [pooledPlayerDataset]);

  const nextPlayer = () => {
    setCurrentPlayer((current) => {
      if (
        pooledPlayerDataset.indexOf(current) + 1 ===
        pooledPlayerDataset.length
      ) {
        alert('No players found further !');
      } else {
        setPrevPlayer(currentPlayer);
        return pooledPlayerDataset[pooledPlayerDataset.indexOf(current) + 1];
      }
    });
  };

  const previousPlayer = () => {
    setCurrentPlayer((current) => {
      if (prevPlayer) {
        const player = prevPlayer;
        setPrevPlayer((prev) => {
          if (prev.SRNO > 1) {
            return pooledPlayerDataset.find((e) => e.SRNO === prev.SRNO - 1);
          } else {
            return pooledPlayerDataset[0];
          }
        });
        return player;
      } else {
        return pooledPlayerDataset.find((e) => e.SRNO === current.SRNO - 1);
      }
    });
  };

  const showBidConsole = () => {
    const e = document.getElementById('bidConsoleForm');
    if (e.classList.contains('display')) {
      e.classList.toggle('display');
      e.classList.toggle('openForm');
      e.classList.toggle('closeForm');
      e.classList.toggle('openFormDisplay');
      e.classList.toggle('closeFormDisplay');
      // setTimeout(() => {e.classList.toggle("closeFormDisplay")},500);
      document.getElementById('auctionRoot').classList.toggle('blurBackground');
    } else {
      e.classList.toggle('display');
      e.classList.toggle('closeForm');
      e.classList.toggle('openFormDisplay');
      e.classList.toggle('closeFormDisplay');
      e.classList.toggle('openForm');
      // setTimeout(() => {e.classList.toggle("openForm");},100);
      document.getElementById('auctionRoot').classList.toggle('blurBackground');
    }
  };

  const cancelBid = async () => {
    if (!currentPlayer) {
      return;
    }
    const obj = {
      player: currentPlayer,
    };
    const resp = await (
      await fetch(`${settings.BaseUrl}/auction/${auctionData._id}/bid`, {
        method: 'DELETE',
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    ).json();
    if (resp.status !== 200) {
      alert(`${resp.status} ${resp.data}`);
    } else {
      alert('Success !');
      setFlag(!flag);
    }
  };

  const jumpPlayer = () => {
    const srno = +prompt('Enter SRNO of player : ');
    setCurrentPlayer((current) => {
      if (pooledPlayerDataset.find((e) => e.SRNO === srno)) {
        const player = pooledPlayerDataset.find((e) => e.SRNO === srno);
        setPrevPlayer(current);
        console.log(player);
        return player;
      }
      alert(`No player found with given srno : ${srno}`);
      return current;
    });
  };

  return (
    <>
      <div
        className="auctionViewRootDiv border border-success"
        id="auctionViewDivRoot"
      >
        <div className="row border-bottom">
          <div className="col-4 border-right">
            <div className="d-flex align-items-center h-100">
              <div className="informationContainer mx-5">
                <div className="d-flex my-5">
                  <label className="h1 info-label">
                    {currentPlayer ? currentPlayer.Name : null}
                  </label>
                </div>
                <div className="d-flex my-2">
                  <label className="h1 info-label">
                    {currentPlayer ? currentPlayer.Country : null}
                  </label>
                </div>
                <div className="d-flex my-2">
                  <label className="h1 info-label">
                    {currentPlayer ? currentPlayer.IPL2022Team : null}
                  </label>
                </div>
                <div className="d-flex my-2">
                  <label className="h1 info-label">
                    {currentPlayer ? currentPlayer.PlayingRole : null}
                  </label>
                </div>
                <div className="d-flex my-2">
                  <label className="h1 info-label-imp">
                    {currentPlayer ? currentPlayer.CUA : null}
                  </label>
                </div>
                <div className="d-flex my-2">
                  <label className="h1 info-label-imp">
                    {currentPlayer ?
                      `${currentPlayer.IPLMatches} Matches` :
                      null}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 border-right">
            <div className="d-flex justify-content-center pt-5">
              {currentPlayer ? (
                <img
                  src={currentPlayer.IMGURL}
                  className="img-thumbnail shadow p-3 playerImage"
                  alt=""
                />
              ) : null}
            </div>
            <div className="d-flex justify-content-center pt-3">
              {currentPlayer ? (
                countryCodes ? (
                  <img
                    crossOrigin="anonymous"
                    src={`https://flagcdn.com/32x24/${countryCodes[currentPlayer.Country]}.png`}
                    className="flag-image"
                    alt=""
                  />
                ) : null
              ) : null}
              {/* { currentPlayer ? <i className={`flag flag-${currentPlayer.Country}`}></i> : null } */}
            </div>
            <div className="d-flex justify-content-center py-4 text-danger h4">
              {currentPlayer ?
                currentPlayer.SOLD ?
                  `SOLD to ${currentPlayer.SOLD}` :
                  null :
                null}
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex align-items-center h-100">
              <div className="informationContainer mx-5">
                <div className="d-flex my-5">
                  <label className="h1 info-label-price px-5 py-1">
                    {currentPlayer ? `${currentPlayer.BasePrice} Lakhs` : null}
                  </label>
                </div>
                <div className="rounded shadow-lg img-thumbnail">
                  {chartData ? (
                    <LineBarChart data={chartData} option={chartOption} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row my-3">
          <div className="col-3">
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => previousPlayer()}
              >
                <i className="fa-solid fa-backward"></i>
              </button>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex justify-content-center">
              {currentPlayer ? (
                currentPlayer.SOLD ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => cancelBid()}
                  >
                    Cancel Bid
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => showBidConsole()}
                  >
                    Bid
                  </button>
                )
              ) : (
                false
              )}
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex justify-content-center">
              <button className="btn btn-info" onClick={() => jumpPlayer()}>
                Jump
              </button>
            </div>
          </div>
          <div className="col-3">
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary" onClick={() => nextPlayer()}>
                <i className="fa-solid fa-forward"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="closeForm closeFormDisplay" id="bidConsoleForm">
        {auctionData && currentPlayer ? (
          <BidConsole
            Teams={auctionData.Teams}
            closeFunc={() => showBidConsole()}
            player={currentPlayer}
            auctionId={auctionData._id}
            updateFunc={() => setFlag((c) => !c)}
          />
        ) : null}
      </div>
    </>
  );
};

export default AuctionView;
