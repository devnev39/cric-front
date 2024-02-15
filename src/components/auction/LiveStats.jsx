import settings from '../../config/settings';
import * as xlsx from 'xlsx';
import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {simplify, number, fraction, round} from 'mathjs';
import fetchModel from '../../helpers/fetchModel';
import PolarAreaChart from '../common/PolarArea';
import {
  MDBBtn,
  MDBCheckbox,
  MDBContainer,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBTable,
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
} from 'mdb-react-ui-kit';

function LiveStats(props) {
  const [socket, setSocket] = useState(null);
  const [auctionData, setAuctionData] = useState(props.auctionObj || null);
  const [totalPlayers, setTotalSoldPlayers] = useState(0);
  const [totalUnsoldPlayers, setTotalUnsoldPlayers] = useState(0);
  const [teamModel, setTeamModel] = useState(null);
  const [playerModel, setPlayerModel] = useState(null);
  const [flag, setFlag] = useState(false);
  const [basicActive, setBasicActive] = useState('tab1');
  const [basicModal, setBasicModal] = useState(false);

  const playerFields = ['SRNO', 'Name', 'BasePrice', 'SoldPrice'];

  const [downloadPlayerFields, setDownloadPlayerFields] = useState({
    fields: playerFields,
  });

  const toggleOpen = () => setBasicModal(!basicModal);

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
  };

  const downloadDataset = () => {
    if (!auctionData) return;
    const teams = JSON.parse(JSON.stringify(auctionData.Teams));
    teams.forEach((team) => {
      team.Players.forEach((player) => {
        Object.keys(player).forEach((k) => {
          if (downloadPlayerFields.fields.indexOf(k) == -1) {
            delete player[k];
          }
        });
      });
    });
    const wb = xlsx.utils.book_new();
    teams.forEach((team) => {
      const ws = xlsx.utils.json_to_sheet(team.Players);
      xlsx.utils.book_append_sheet(wb, ws, team.Name);
    });
    xlsx.writeFile(wb, 'Players.xlsx');
  };

  useEffect(() => {
    const runMe = async () => {
      await fetchModel(
          `${settings.BaseUrl}/wimodels/TeamRuleModel`,
          setTeamModel,
      );
      await fetchModel(
          `${settings.BaseUrl}/wimodels/PlayerRuleModel`,
          setPlayerModel,
      );
    };
    const sck = io(`${settings.BaseUrl}`, {
      withCredentials: true,
    });
    sck.on('connect', () => {
      setSocket(sck);
    });
    runMe();
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    if (!socket.connected) {
      return;
    }
    socket.on(`${props.auctionObj._id}`, (data) => {
      data.dPlayers = data.dPlayers.concat(data.Add);
      let total = 0;
      for (const team of data.Teams) {
        total += team.Players.length;
      }
      setTotalSoldPlayers(total);
      setAuctionData(data);
    });
  }, [socket]);

  useEffect(() => {
    if (!teamModel || !playerModel) {
      return;
    }
    if (!auctionData) {
      return;
    }
    auctionData.dPlayers = auctionData.dPlayers.concat(auctionData.Add);
    let total = 0;
    for (const team of auctionData.Teams) {
      total += team.Players.length;
    }
    setTotalSoldPlayers(total);
    setTotalUnsoldPlayers(auctionData.dPlayers.length - total);
    if (auctionData.Teams.length) {
      for (const team of auctionData.Teams) {
        if (team.Players.length) {
          team.Players = team.Players.map((player) => {
            if (!player) {
              return null;
            }
            if (Object.keys(player).length < 3) {
              const dataset =
                auctionData.poolingMethod === 'Composite' ?
                  auctionData.dPlayers :
                  auctionData.cPlayers;
              for (const p of dataset) {
                if (p._id === player._id) {
                  return p;
                }
              }
            }
            return player;
          });
        }
      }
    }
    for (const team of auctionData.Teams) {
      for (const rule of auctionData.Rules) {
        let cRule = JSON.parse(JSON.stringify(rule));
        if (cRule.type === 'Team') {
          for (const key of Object.keys(teamModel)) {
            const re = new RegExp(`\\b${key}\\b`, 'g');
            while (cRule.rule.match(re)) {
              cRule.rule = cRule.rule.replace(re, team[key]);
            }
          }
          cRule.rule = simplify(cRule.rule).toString();
          while (cRule.rule.includes(' ')) {
            cRule.rule = cRule.rule.replace(' ', '');
          }
          try {
            team[rule.ruleName] = round(number(fraction(cRule.rule)), 2);
          } catch (error) {
            team[rule.ruleName] = 0;
          }
        }
        if (cRule.type === 'Player') {
          let ruleAvg = 0;
          let soldTotal = 0;
          for (const player of team.Players) {
            if (!player) {
              continue;
            }
            const cRuleHolder = JSON.parse(JSON.stringify(cRule));
            for (const key of Object.keys(playerModel)) {
              const re = new RegExp(`\\b${key}\\b`, 'g');
              while (cRule.rule.match(re)) {
                cRule.rule = cRule.rule.replace(re, player[key]);
              }
            }
            try {
              cRule.rule = simplify(cRule.rule).toString();
            } catch (error) {}

            while (cRule.rule.includes(' ')) {
              cRule.rule = cRule.rule.replace(' ', '');
            }
            try {
              const ans = round(number(fraction(cRule.rule)), 2);
              if (isNaN(ans)) {
                player[rule.ruleName] = 0;
              } else {
                player[rule.ruleName] = ans;
              }
            } catch (error) {
              player[rule.ruleName] = 0;
            }
            soldTotal += player.SoldPrice;
            ruleAvg += player[rule.ruleName];
            cRule = cRuleHolder;
          }
          team[`${cRule.ruleName}avg`] = round(
              ruleAvg / team.Players.length,
              2,
          );
          team['totalSoldPrice'] = soldTotal;
        }
      }
    }
    setFlag(!flag);
  }, [auctionData, teamModel, playerModel]);

  return (
    <div className="w-100">
      <MDBTabs fill className="mb-3">
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick('tab1')}
            active={basicActive == 'tab1'}
          >
            Live Stats
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick('tab2')}
            active={basicActive == 'tab2'}
          >
            Downloads
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>
      <MDBTabsContent>
        <MDBTabsPane open={basicActive == 'tab1'}>
          <div className="d-flex display-5 fw-normal py-3 justify-content-center">
            Live Stats
          </div>
          <div className="d-flex justify-content-evenly mt-5">
            <div className="h5 rounded border shadow p-2">
              Total Sold Players :{' '}
              <span className="text-success">{totalPlayers}</span>
            </div>
            <div className="h5 rounded border shadow p-2">
              Total Remaining :{' '}
              <span className="text-danger">{totalUnsoldPlayers}</span>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <MDBContainer>
              {auctionData ?
                auctionData.Teams ?
                  auctionData.Teams.map((team) => {
                    if (!auctionData.Rules) {
                      return null;
                    }
                    for (const team of auctionData.Teams) {
                      for (const player of team.Players) {
                        if (player) {
                          if (Object.keys(player).length < 3) {
                            return null;
                          }
                        }
                      }
                    }

                    const tableHeads = [
                      'Name',
                      'Current',
                      'Budget',
                      'AuctionMaxBudget',
                      'TotalPlayers',
                      'Remaining',
                    ];
                    auctionData.Rules.forEach((rule) => {
                      if (rule.type === 'Team') {
                        tableHeads.push(rule.ruleName);
                      }
                    });
                    let teamheads = tableHeads.map((head) => {
                      return <th key={`${head}`}>{head}</th>;
                    });
                    teamheads = <tr key={`${team.Name}`}>{teamheads}</tr>;
                    const teambody = (
                      <tr>
                        {tableHeads.map((prop) => {
                          if (prop === 'Name') {
                            return (
                              <td
                                className="bg-dark text-white"
                                key={`${team[prop]}${prop}`}
                              >
                                {team[prop]}
                              </td>
                            );
                          }
                          if (prop === 'TotalPlayers') {
                            // setTotalSoldPlayers(totalPlayers + team.Players.length);
                            return (
                              <td key={`${prop}`}>{team.Players.length}</td>
                            );
                          }
                          if (prop === 'Remaining') {
                            return (
                              <td key={`${prop}`}>
                                {auctionData.MaxPlayers - team.Players.length}
                              </td>
                            );
                          }
                          return (
                            <td key={`${team[prop]}${prop}`}>{team[prop]}</td>
                          );
                        })}
                      </tr>
                    );

                    const theadsProps = [
                      'No',
                      'Name',
                      'BasePrice',
                      'AuctionedPrice',
                      'SoldPrice',
                    ];

                    const ruleAvgs = [];

                    auctionData.Rules.forEach((rule) => {
                      if (rule.type === 'Team') {
                        return;
                      }
                      ruleAvgs.push(
                          <div
                            key={`${rule.ruleName}$avg`}
                            className="text-danger h5"
                          >
                            {rule.ruleName}
                            <sub>avg</sub> : {team[`${rule.ruleName}avg`]}
                          </div>,
                      );
                      theadsProps.push(rule.ruleName);
                    });
                    ruleAvgs.push(
                        <div key={`SoldTotal`} className="text-danger h5">
                          TotalSold : {team[`totalSoldPrice`]}
                        </div>,
                    );
                    let theads = theadsProps.map((head) => {
                      return <th key={`${head}`}>{head}</th>;
                    });
                    theads = <tr key={`${team.Name}`}>{theads}</tr>;

                    const tbody = team.Players.map((player) => {
                      if (!player) {
                        return null;
                      }
                      const tds = theadsProps.map((prop) => {
                        if (prop === 'No') {
                          return (
                            <td key={`${player.Name}${prop}`}>
                              {team.Players.indexOf(player) + 1}
                            </td>
                          );
                        }
                        return (
                          <td key={`${player.Name}${prop}`}>
                            {player[prop] || NaN}
                          </td>
                        );
                      });
                      return <tr key={`${player.SRNO}`}>{tds}</tr>;
                    });

                    return (
                      <div
                        className="shadow rounded p-3 mt-5"
                        style={{width: '100%'}}
                        key={`${auctionData.Teams.indexOf(team)}${team.Name}`}
                      >
                        <div className="d-flex justify-content-start">
                          <div>
                            <div className="w-100">
                              <MDBTable
                                hover
                                striped
                                bordered
                                borderColor="dark"
                              >
                                <thead className="h6">{teamheads}</thead>
                                <tbody className="h5">{teambody}</tbody>
                              </MDBTable>
                            </div>
                            <div className="w-100">
                              <MDBTable
                                hover
                                striped
                                bordered
                                borderColor="primary"
                              >
                                <thead className="table-head h6">
                                  {theads}
                                </thead>
                                <tbody className="h5">{tbody}</tbody>
                              </MDBTable>
                              <div>{ruleAvgs}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }) :
                  null :
                null}
            </MDBContainer>
            <div style={{width: '30%'}}>
              {auctionData ?
                auctionData.Teams ?
                  auctionData.Rules.map((rule) => {
                    return (
                      <div
                        key={auctionData.Rules.indexOf(rule)}
                        className="shadow rounded p-2 my-2"
                      >
                        <PolarAreaChart
                          data={auctionData.Teams}
                          option={{
                            ykey:
                                rule.type === 'Player' ?
                                  `${rule.ruleName}avg` :
                                  rule.ruleName,
                            xkey: 'Name',
                            ylabel: 'Value',
                          }}
                        />
                        <div className="d-flex justify-content-center h5">
                          {rule.ruleName}
                        </div>
                      </div>
                    );
                  }) :
                  null :
                null}
            </div>
          </div>
        </MDBTabsPane>
        <MDBTabsPane open={basicActive == 'tab2'}>
          <div className="fs-2 square-border border-bottom mb-5 border-3">
            Team data download
          </div>
          <MDBBtn className="btn-success" size="lg" onClick={toggleOpen}>
            <MDBIcon size="lg" fas icon="arrow-down" />
            Download all team data
          </MDBBtn>
          <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex="-1">
            <MDBModalDialog>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>
                    Select properties to be included
                  </MDBModalTitle>
                </MDBModalHeader>
                <MDBModalBody>
                  {playerFields.map((key) => {
                    return (
                      <MDBCheckbox
                        defaultChecked
                        key={key}
                        label={key}
                        onChange={(c) => {
                          setDownloadPlayerFields((current) => {
                            const fields = current.fields;
                            if (c.target.checked) {
                              fields.push(key);
                            } else if (fields.indexOf(key) != -1) {
                              fields.splice(fields.indexOf(key), 1);
                            }
                            console.log(fields);
                            return {...current, fields: fields};
                          });
                        }}
                      />
                    );
                  })}
                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn
                    color="success"
                    onClick={() => {
                      downloadDataset();
                      toggleOpen();
                    }}
                  >
                    Download
                  </MDBBtn>
                  <MDBBtn color="secondary" onClick={toggleOpen}>
                    Close
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </MDBTabsPane>
      </MDBTabsContent>
    </div>
  );
}

export default LiveStats;
