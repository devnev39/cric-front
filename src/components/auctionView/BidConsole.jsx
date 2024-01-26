import settings from '../../config/settings';
import React, {useState} from 'react';
import fetchData from '../../helpers/fetchData';

/**
 *
 * @param {Object} props.Teams Array of all teams
 * @param {Object} props.player Player to bid
 * @param {Object} props.closeFunc Close function for the form
 * @param {Object} props.updateFunc update trigger for parent form
 * @returns
 */
function BidConsole(props) {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const tableFields = ['No', 'Name', 'Budget', 'Current'];
  const setTableHead = () => {
    const heads = [];
    for (const h of tableFields) {
      heads.push(<th key={`${tableFields.indexOf(h)}${h}`}>{h}</th>);
    }
    return <tr key={'tablehead1'}>{heads}</tr>;
  };

  const setTableBody = () => {
    const trs = [];
    if (!props.Teams) {
      return;
    }
    for (const team of props.Teams) {
      let per = (team.Current / team.Budget) * 100;
      if (per > 66) {
        per = 'table-success';
      } else if (per > 40) {
        per = 'table-warning';
      } else {
        per = 'table-danger';
      }
      const tds = [];
      for (const field of tableFields) {
        tds.push(
            <td key={`${team.Name}${tableFields.indexOf(field)}`}>
              {team[field]}
            </td>,
        );
      }
      trs.push(
          <tr
            key={`${team.Name}${team.Budget}`}
            onClick={() => setSelectedTeam(team)}
            className={`${per} team-row`}
          >
            {tds}
          </tr>,
      );
    }
    return trs;
  };

  const placeBid = async () => {
    const bid = +document.getElementById('bidAmountInput').value;
    if (!bid) {
      alert('Bad input !');
      return;
    }
    if (!selectedTeam) {
      alert('Select a team !');
      return;
    }
    if (selectedTeam.Current < bid) {
      alert('No budget to buy the player !');
      return;
    }
    const bidObj = {
      amt: bid,
      player: props.player,
      team: selectedTeam,
    };
    const resp = await fetchData(
        `${settings.BaseUrl}/auction/${props.auctionId}/bid`,
        {bid: bidObj},
    );
    if (resp.status !== 200) {
      alert(`${resp.status} ${resp.data}`);
    } else {
      alert('Success !');
      props.updateFunc();
      props.closeFunc();
    }
  };
  return (
    <>
      <div className="bidConsoleRootDiv rounded shadow p-5 pt-3">
        <div className="d-flex justify-content-center">
          <div className="h3">Bid Console</div>
        </div>
        <div className="row mt-3">
          <div className="col-6">
            <div className="d-flex justify-content-center">
              <label className="info-label h4">{props.player.Name}</label>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex justify-content-center">
              <label className="info-label h4">{`${props.player.BasePrice} Lakhs`}</label>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-3 shadow">
          <div className="scrollable shadow border">
            <table
              className="table table-striped table-bordered"
              cellSpacing="0"
              width="100%"
            >
              <thead>{props.Teams ? setTableHead() : null}</thead>
              <tbody className="table-hover">
                {props.Teams ? setTableBody() : null}
              </tbody>
            </table>
          </div>
        </div>
        {selectedTeam ? (
          <div className="d-flex justify-content-center">
            <div className="bidControlDiv mt-5" id="bidControlDiv">
              <div className="row">
                <div className="col-6">
                  <label className="h4">{selectedTeam.Name}</label>
                </div>
                <div className="col-6 d-flex justify-content-center">
                  <input
                    type="number"
                    className=""
                    placeholder="Bid Amt."
                    id="bidAmountInput"
                  ></input>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-success mx-5"
                  onClick={() => placeBid()}
                >
                  Bid
                </button>
                <button
                  className="btn btn-danger mx-5"
                  onClick={() => props.closeFunc()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default BidConsole;
