import settings from '../../config/settings';
import * as xlsx from 'xlsx';
import React, {useEffect, useState} from 'react';
import fetchData from '../../helpers/fetchData';
import fetchModel from '../../helpers/fetchModel';
import QueryBuiler from '../../helpers/queryBuilder';
import LineBarChart from '../common/LineBarChart';
import PolarAreaChart from '../common/PolarArea';
import SubmitForm from '../common/SubmitForm';
import UpdateForm from '../common/UpdateForm';
import './styles.css';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from 'mdb-react-ui-kit';

function Players(props) {
  const [chartData, setChartData] = useState(null);
  const [playerLenght, setPlayerLength] = useState(0);
  const [totalCountries, setTotalCountries] = useState(0);
  const [totalIPLTeams, setTotalIplTeams] = useState(0);
  const [playingRoleCount, setPlayingRoleCount] = useState(0);
  const [CUACount, setCUACount] = useState(0);
  const [mPlayers, setMplayers] = useState([]);
  const [aPlayers, setAplayers] = useState([]);
  const [rPlayers, setRplayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const [showUploadDiv, setShowUploadDiv] = useState(false);

  const [downloadPlayerDatasetOptions, setDownloadDPlayerDatasetOptions] =
    useState({
      fields: ['team_id', '_id', '__v', 'IMGURL', 'SOLD'],
      options: {},
    });

  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);
  // const [playerModel,setPlayerModel] - u

  const option = {
    // indexAxis : 'y',
    xkey: 'Name',
    ylinekey: 'AuctionedPrice',
    ybarkey: 'BasePrice',
    xlabel: 'Name',
    ylinelabel: 'AuctionedPrice',
    ybarlabel: 'BasePrice',
    chartTitle: 'Players with highest base value with auctioned value',
    chartTitleSize: 20,
    chartTitlePosition: 'top',
  };

  const area1Option = {
    xkey: 'CUA',
    ykey: 'Count',
    ylabel: 'Players',
    chartTitle: 'No. of capped and uncapped players',
    chartTitleSize: 20,
    chartTitlePosition: 'bottom',
  };

  const area2Option = {
    xkey: 'PlayingRole',
    ykey: 'Count',
    ylabel: 'Players',
    chartTitle: 'No. of player according to playing role',
    chartTitleSize: 20,
    chartTitlePosition: 'bottom',
  };

  const tableFields = [
    'SRNO',
    'Name',
    'Country',
    'BasePrice',
    'AuctionedPrice',
    'TotalRuns',
    'BattingAvg',
    'StrikeRate',
    'Action',
  ];

  const downloadTableFields = tableFields.concat([
    'CUA',
    'SoldPrice',
    'PlayingRole',
    'IPL2022Team',
    'IPLMatches',
  ]);

  const requestAndSetData = async (queries, setObject) => {
    const res = await fetchData(`${settings.BaseUrl}/player/query`, {
      query: queries,
    });
    if (res.status !== 200) {
      alert(`${res.status} ${res.data}`);
    } else {
      setObject(res.data);
    }
  };

  const requestData = async () => {
    const query = new QueryBuiler();
    requestAndSetData(
        query.sort({BasePrice: -1}).limit(10).queries,
        setChartData,
    );
    query.clear();
    requestAndSetData(query.count('Name').queries, setPlayerLength);
    query.clear();
    requestAndSetData(
        query.group({_id: '$Country'}).queries,
        setTotalCountries,
    );
    query.clear();
    requestAndSetData(
        query.group({_id: '$IPL2022Team'}).queries,
        setTotalIplTeams,
    );
    query.clear();
    requestAndSetData(
        query
            .group({_id: '$PlayingRole', Count: {$sum: 1}})
            .project({_id: 0, PlayingRole: '$_id', Count: 1}).queries,
        setPlayingRoleCount,
    );
    query.clear();
    requestAndSetData(
        query
            .group({_id: '$CUA', Count: {$sum: 1}})
            .project({_id: 0, CUA: '$_id', Count: 1}).queries,
        setCUACount,
    );
    query.clear();

    const players = await (
      await fetch(
          `${settings.BaseUrl}/auction/${props.auctionObj._id}/players`,
          {credentials: 'include'},
      )
    ).json();
    setMplayers(players.data.Main);
    setAplayers(players.data.Add);
    setRplayers(players.data.Rmv);
    document.getElementById('customSwitch1').checked = !!(
      props.auctionObj.poolingMethod === 'Custom'
    );
    setShowUploadDiv(document.getElementById('customSwitch1').checked);
  };

  const setTableHead = () => {
    const heads = [];
    for (const h of tableFields) {
      heads.push(<th key={`${tableFields.indexOf(h)}${h}`}>{h}</th>);
    }
    return <tr key={'tablehead1'}>{heads}</tr>;
  };

  const fillColumn = (field, tds, p, condition) => {
    // Fill the column not specified in p
    // Fill action with button depending on condition
    if (condition === 'mPlayers' || condition === 'Add') {
      tds.push(
          <td key={`${field}${p.SRNO}`}>
            <div>
              <MDBBtn
                onClick={() => updatePlayer(p)}
                className="me-2 mb-2"
                size="sm"
                color="primary"
              >
                <MDBIcon fas icon="user-edit" size="sm" />
              </MDBBtn>
              <MDBBtn
                onClick={() => movePlayerAndResponse(p, condition, 'Rmv')}
                className="mb-2"
                size="sm"
                color="danger"
              >
                <MDBIcon fas icon="trash" size="sm" />
              </MDBBtn>
            </div>
          </td>,
      );
    }
    if (condition === 'Rmv') {
      tds.push(
          <td key={`${field}${p.SRNO}`}>
            <button
              className="btn btn-success btn-sm mx-2"
              onClick={() => movePlayerAndResponse(p, 'Rmv', 'mPlayers')}
            >
              <i className="fa-solid fa-trash-arrow-up"></i>
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => movePlayerAndResponse(p)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </td>,
      );
    }
  };

  const movePlayerAndResponse = async (p, src, dest) => {
    if (
      !src &&
      !dest &&
      !window.confirm('Do you want to permantly delete this player ? ')
    ) {
      return;
    }
    const res = await movePlayer(p, src, dest);
    if (res.status === 200) {
      alert('Success !');
      props.trigger();
    } else {
      alert(`${res.status} ${res.data}`);
    }
  };

  const movePlayer = async (p, src, dest) => {
    // src -> source array
    // dest -> destination array
    // player -> player object
    const method = src || dest ? 'PATCH' : 'DELETE';
    return await (
      await fetch(
          `${settings.BaseUrl}/auction/${props.auctionObj._id}/players`,
          {
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({src: src, dest: dest, player: p}),
            credentials: 'include',
          },
      )
    ).json();
  };

  const updatePlayer = (p) => {
    setCurrentPlayer(p);
    toggleSubmitForm('updatePlayerForm');
  };

  const createTableBodyForDataset = (dataset, datasetName, color) => {
    const trs = [];
    const trse = [];
    for (const p of dataset) {
      const tds = [];
      for (const field of tableFields) {
        if (field !== 'Action') {
          tds.push(<td key={`${dataset.indexOf(p)}${field}`}>{p[field]}</td>);
        } else {
          fillColumn(field, tds, p, datasetName);
        }
      }
      if (!p.Edited || datasetName === 'Rmv') {
        trs.push(
            <tr className={`${color || ''}`} key={`${p.SRNO}`}>
              {tds}
            </tr>,
        );
      } else {
        trse.push(
            <tr className={'table-info'} key={`${p.SRNO}`}>
              {tds}
            </tr>,
        );
      }
    }
    return trs.concat(trse);
  };

  const setTableBody = () => {
    const trs = [];
    const mp = createTableBodyForDataset(mPlayers, 'mPlayers');
    const rp = createTableBodyForDataset(rPlayers, 'Rmv', 'table-danger');
    const add = createTableBodyForDataset(aPlayers, 'Add', 'table-success');
    return trs.concat(mp, rp, add);
  };

  const commandCorrenspondance = {
    added: 'table-success',
    removed: 'table-danger',
    edited: 'table-info',
  };

  const searchInput = () => {
    const val = document.getElementById('searchInput').value;
    const tbody = document.getElementById('tableBody');
    const trs = tbody.getElementsByTagName('tr');
    for (const tr of trs) {
      if (tr.textContent.toLowerCase().indexOf(val.toLowerCase()) === -1) {
        tr.style.display = 'None';
      } else {
        tr.style.display = '';
      }

      if (
        val.toLowerCase() === 'added' ||
        val.toLowerCase() === 'removed' ||
        val.toLowerCase() === 'edited'
      ) {
        if (tr.classList.contains(commandCorrenspondance[val.toLowerCase()])) {
          tr.style.display = '';
        } else {
          tr.style.display = 'None';
        }
      }
      if (val.toLowerCase() === '$') {
        let flag = false;
        Object.values(commandCorrenspondance).forEach((k) => {
          if (tr.classList.contains(k)) {
            flag = true;
          }
        });
        if (flag) {
          tr.style.display = '';
        } else {
          tr.style.display = 'None';
        }
      }
    }
  };

  const toggleSubmitForm = (formId) => {
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
          .getElementById('playersMainDiv')
          .classList.toggle('blurBackground');
      setCurrentPlayer(null);
    } else {
      e.classList.toggle('display');
      e.classList.toggle('closeForm');
      e.classList.toggle('openFormDisplay');
      e.classList.toggle('closeFormDisplay');
      setTimeout(() => {
        e.classList.toggle('openForm');
      }, 100);
      document
          .getElementById('playersMainDiv')
          .classList.toggle('blurBackground');
    }
  };

  const downloadDataset = async () => {
    const mp = JSON.parse(JSON.stringify(mPlayers));
    const ad = JSON.parse(JSON.stringify(aPlayers));
    const rm = JSON.parse(JSON.stringify(rPlayers));
    let all = null;
    if (downloadPlayerDatasetOptions.options.removed) {
      all = rm;
    } else {
      all = mp.concat(ad);
    }
    if (!all) {
      window.alert('Not found !');
    }
    all.forEach((player) => {
      for (const neg of downloadPlayerDatasetOptions.fields) {
        delete player[neg];
      }
      return player;
    });
    const ws = xlsx.utils.json_to_sheet(all);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Players');
    xlsx.writeFile(wb, 'Players.xlsx');
  };

  const poolingMethodChanged = async () => {
    const state = document.getElementById('customSwitch1').checked;
    if (state) {
      props.auctionObj.poolingMethod = 'Custom';
    } else {
      props.auctionObj.poolingMethod = 'Composite';
    }
    const req = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auction: {
          _id: props.auctionObj._id,
          poolingMethod: props.auctionObj.poolingMethod,
        },
      }),
      credentials: 'include',
    };
    const resp = await (
      await fetch(`${settings.BaseUrl}/auction/${props.auctionObj._id}`, req)
    ).json();
    if (resp.status === 200) {
      alert('Success !');
      setShowUploadDiv(state);
    } else {
      alert(`${resp.status} ${resp.data}`);
    }
    props.trigger();
  };

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  }

  const uploadDataset = async () => {
    try {
      let model = null;
      await fetchModel(`${settings.BaseUrl}/wimodels/player`, (res) => {
        model = res;
      });
      alert(
          `The data should be in following format : ${JSON.stringify(model)}`,
      );
      const file = document.getElementById('datasetFileInput').files[0];
      let data = await readFileAsync(file);
      data = JSON.parse(data);
      if (data.length) {
        const Req = {
          method: 'COPY',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({players: data}),
          credentials: 'include',
        };
        const resp = await (
          await fetch(
              `${settings.BaseUrl}/auction/${props.auctionObj._id}/players`,
              Req,
          )
        ).json();
        if (resp.status === 200) {
          alert('Success !');
          props.trigger();
        } else {
          alert(`${resp.status} ${resp.data}`);
        }
      } else {
        throw new Error('Array not detected or empty array !');
      }
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    const run = async () => await requestData();
    run();
  }, [props.auctionObj]);
  return (
    <>
      <div className="mt-3" id="playersMainDiv">
        <div className="d-flex display-5 fw-normal py-3 justify-content-center">
          Default player list overview
        </div>
        <div className="m-2 pb-5 border">
          <div className="mt-3">
            <MDBContainer>
              <MDBRow className="gap-2">
                <MDBCol lg={8}>
                  <div className="rounded shadow p-3">
                    {chartData ? (
                      <LineBarChart data={chartData} option={option} />
                    ) : null}
                  </div>
                </MDBCol>
                <MDBCol>
                  <MDBContainer className="gap-5">
                    <MDBRow className="mb-3">
                      <MDBCol>
                        <MDBCard alignment="center">
                          <MDBCardBody>
                            <div className="display-5">
                              {playerLenght[0] ? playerLenght[0].Name : 0}
                            </div>
                            <div className="fs-4">Total Players</div>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol>
                        <MDBCard alignment="center">
                          <MDBCardBody>
                            <div className="display-5">
                              {Object.keys(totalCountries).length}
                            </div>
                            <div className="fs-4">Countries</div>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol>
                        <MDBCard alignment="center">
                          <MDBCardBody>
                            <div className="display-5">
                              {Object.keys(totalIPLTeams).length}
                            </div>
                            <div className="fs-4">IPL Teams</div>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBRow>
                  </MDBContainer>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
          <div className="mt-5">
            <MDBContainer>
              <MDBRow center>
                <MDBCol lg={4}>
                  <div className="shadow rounded p-3">
                    {CUACount ? (
                      <PolarAreaChart data={CUACount} option={area1Option} />
                    ) : null}
                  </div>
                </MDBCol>
                <MDBCol lg={4}>
                  <div className="shadow rounded p-3">
                    {playingRoleCount ? (
                      <PolarAreaChart
                        data={playingRoleCount}
                        option={area2Option}
                      />
                    ) : null}
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
        </div>
        <div className="border m-2 p-3">
          <div className="m-2">
            <MDBContainer>
              <MDBRow>
                <MDBCol>
                  <label htmlFor="serachInput" className="h5">
                    Search :
                  </label>
                  <input
                    name="searchInput"
                    placeholder="$|added|removed|edited"
                    id="searchInput"
                    className="mx-3 w-50"
                    onKeyUp={searchInput}
                  />
                </MDBCol>
                <MDBCol>
                  <MDBRow center>
                    <MDBCol lg={3}>
                      <MDBCard
                        alignment="center"
                        className="bg-success fw-bold"
                      >
                        <MDBCardBody>
                          <div className="fs-3">{aPlayers.length}</div>
                          <figcaption>Added</figcaption>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol lg={3}>
                      <MDBCard alignment="center" className="bg-danger fw-bold">
                        <MDBCardBody>
                          <div className="fs-3">{rPlayers.length}</div>
                          <figcaption>Removed</figcaption>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol lg={3}>
                      <MDBCard alignment="center" className="bg-info fw-bold">
                        <MDBCardBody>
                          <div className="fs-3">
                            {mPlayers.length ?
                              mPlayers.reduce((i, current) => {
                                if (current.Edited) {
                                  return i + 1;
                                }
                                return 0;
                              }) :
                              0}
                          </div>
                          <figcaption>Edited</figcaption>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol lg={3}>
                      <MDBCard alignment="center" className="fw-bold">
                        <MDBCardBody>
                          <div className="fs-3">
                            {aPlayers.length +
                              rPlayers.length +
                              mPlayers.length}
                          </div>
                          <figcaption>Total</figcaption>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                  {/* {mPlayers ?
                          `Total Players : ${mPlayers.length + aPlayers.length}` :
                          null} */}
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
          <MDBContainer>
            <MDBRow>
              <MDBCol lg={12}>
                <div className="border shadow rounded players-table-container">
                  <MDBTable align="middle">
                    <MDBTableHead>{setTableHead()}</MDBTableHead>
                    <MDBTableBody id="tableBody">
                      {mPlayers ? setTableBody() : null}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              </MDBCol>
              <MDBCol>
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-success"
                    onClick={() => toggleSubmitForm('newPlayerForm')}
                  >
                    Add Player
                  </button>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <div className="d-flex justify-content-center mt-5">
            <div>
              <div className="">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customSwitch1"
                  onChange={() => poolingMethodChanged()}
                />
                <label className="custom-control-label" htmlFor="customSwitch1">
                  Use custom dataset
                </label>
              </div>
              <div
                className="mt-5"
                id="uploadDatasetBtnDiv"
                style={{display: `${showUploadDiv ? '' : 'None'}`}}
              >
                <label className="form-label" htmlFor="customFile">
                  Select JSON file
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="datasetFileInput"
                  accept=".json"
                />
                <button
                  onClick={uploadDataset}
                  type="button"
                  className="btn btn-outline-success mt-4"
                  data-mdb-ripple-color="dark"
                >
                  Upload Dataset
                </button>
              </div>
              <div className="mt-5">
                <button
                  className="btn btn-info mx-3"
                  onClick={() => {
                    setDownloadDPlayerDatasetOptions((prev) => {
                      const a = prev;
                      a.options.removed = false;
                      return {...prev, options: a.options};
                    });
                    toggleOpen();
                  }}
                >
                  Download Total Players
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => {
                    setDownloadDPlayerDatasetOptions((prev) => {
                      const a = prev;
                      a.options.removed = true;
                      return {...prev, options: a.options};
                    });
                    toggleOpen();
                  }}
                >
                  Download Removed Players
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="closeForm closeFormDisplay" id="newPlayerForm">
        <SubmitForm
          postUrl={`/auction/${props.auctionObj._id}/players`}
          modelKey={'player'}
          neglects={[]}
          closeFunc={() => toggleSubmitForm('newPlayerForm')}
          parentKey={'newPlayer1'}
          navigate={props.trigger}
        />
      </div>
      <div className="closeForm closeFormDisplay" id="updatePlayerForm">
        {currentPlayer ? (
          <UpdateForm
            modelKey={'player'}
            neglects={[]}
            model={currentPlayer}
            postUrl={`/auction/${props.auctionObj._id}/players`}
            setFunc={props.setAuctionObj}
            closeFunc={() => toggleSubmitForm('updatePlayerForm')}
            parentKey={'update2'}
            navigate={props.trigger}
          />
        ) : null}
      </div>
      <MDBModal open={basicModal} setOpen={() => toggleOpen} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Select properties to be added to excel file
              </MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              {downloadTableFields.map((key) => {
                return (
                  <MDBCheckbox
                    key={key}
                    defaultChecked
                    label={key}
                    onChange={(e) =>
                      setDownloadDPlayerDatasetOptions((prev) => {
                        const a = prev;
                        if (a.fields.indexOf(key) == -1 && !e.target.checked) {
                          a.fields.push(key);
                        } else if (
                          a.fields.indexOf(key) != -1 &&
                          e.target.checked
                        ) {
                          a.fields.remove(key);
                        }
                        console.log(a);
                        return {...prev, fields: a.fields};
                      })
                    }
                  />
                );
              })}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="success" onClick={() => downloadDataset()}>
                Download
              </MDBBtn>
              <MDBBtn color="secondary" onClick={() => toggleOpen()}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default Players;
