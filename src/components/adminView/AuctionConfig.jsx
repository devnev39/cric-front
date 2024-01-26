// import { useLocation, useNavigate } from "react-router";
import React, {useState, useEffect} from 'react';
import SubmitForm from '../../components/common/SubmitForm';
import UpdateForm from '../../components/common/UpdateForm';
import settings from '../../config/settings';

const AuctionConfig = () => {
  const [rows, setRows] = useState(null);
  const [auction, setAuction] = useState(null);
  const [currentAuction, setCurrentAuction] = useState(null);

  const [trigger, setTrigger] = useState(true);
  // const {state} = useLocation();
  // const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, [trigger]);

  useEffect(() => {
    setRows(makeRow());
  }, [auction]);

  const fetchAuctions = async () => {
    const resp = await (
      await fetch(`${settings.BaseUrl}/admin/auctions`, {
        credentials: 'include',
      })
    ).json();
    if (resp.status === 200) {
      setAuction(resp.data);
    } else {
      window.alert(`${resp.data}`);
    }
  };

  const makeRow = () => {
    if (!auction) {
      return null;
    }
    return auction.map((user) => {
      return (
        <div
          key={`${user._id}}`}
          className="row mb-4 shadow-sm rounded h5 auctionRowContent p-2"
        >
          <div
            className="col-2 d-flex justify-content-center"
            style={{borderRight: `2px dotted`}}
          >
            {user.No}
          </div>
          <div
            className="col-5 d-flex justify-content-center"
            style={{borderRight: `2px dotted`}}
          >
            {user.Name}
          </div>
          <div
            className="col-2 d-flex justify-content-center"
            style={{borderRight: `2px dotted`}}
          >
            {user.MaxBudget}
          </div>
          <div
            className="col-1 d-flex justify-content-center"
            style={{borderRight: `2px dotted`}}
          >
            <input
              type="checkbox"
              checked={user.AllowLogin}
              onChange={(e) => updateUser(user)}
            />
          </div>
          <div className="col-2 d-flex justify-content-center">
            <button
              className="btn btn-danger btn-sm mx-2"
              onClick={() => deleteUser(user)}
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
            <button
              className="btn btn-warning btn-sm"
              onClick={() => updateUser(user)}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      );
    });
  };

  const updateUser = (user) => {
    setCurrentAuction(user);
    toggleSubmitForm('updateForm');
  };

  const deleteUser = async (user) => {
    if (
      !window.confirm(
          'Do you want do delete this auction ? All of the data will be deleted !',
      )
    ) {
      return;
    }
    const resp = await (
      await fetch(`${settings.BaseUrl}/admin/auctions/${user._id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({AuctionViewModelAdmin: user}),
      })
    ).json();
    if (resp.status === 200) {
      alert('Success !');
      setAuction(resp.data);
    } else {
      alert(`${resp.status} ${resp.data}`);
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
          .getElementById('adminMainDiv')
          .classList.toggle('blurBackground');
      setCurrentAuction(null);
    } else {
      e.classList.toggle('display');
      e.classList.toggle('closeForm');
      e.classList.toggle('openFormDisplay');
      e.classList.toggle('closeFormDisplay');
      setTimeout(() => {
        e.classList.toggle('openForm');
      }, 100);
      document
          .getElementById('adminMainDiv')
          .classList.toggle('blurBackground');
    }
    // const ele = document.getElementsByClassName("newUserDivButton")[0];
    // if (ele.innerText === '+') {
    //   ele.innerText = '-';
    // } else {
    //   ele.innerText = '+';
    // }
  };

  return (
    <>
      <div id="adminMainDiv">
        <div
          className="optionContainerRoot mt-5 d-flex justify-content-center"
          id="teamMainDiv"
        >
          <div className="rounded shadow p-5 teams-container">
            <div className="d-flex justify-content-center border-bottom">
              <h2 className="pb-5">Auctions</h2>
            </div>
            <div className="team-items-container p-3">
              {rows || <h3>o-o</h3>}
            </div>
          </div>
        </div>
        {/* <div className="d-flex justify-content-center">
                <div className="rounded shadow my-5 px-5 h4 newTeamDivButton" onClick={() => {toggleSubmitForm("submitForm")}}>
                    +
                </div>
            </div> */}
      </div>
      <div className="closeFormDisplay closeForm" id="submitForm">
        <div className="d-flex justify-content-center">
          <SubmitForm
            postUrl={'/admin/auctions'}
            modelKey={'AuctionViewModelAdmin'}
            neglects={['_id']}
            closeFunc={() => toggleSubmitForm('submitForm')}
            parentKey="submit1"
          />
        </div>
      </div>
      <div className="closeFormDisplay closeForm" id="updateForm">
        <div className="d-flex justify-content-center">
          {currentAuction ? (
            <UpdateForm
              modelKey={'AuctionViewModelAdmin'}
              neglects={['_id']}
              model={currentAuction}
              postUrl={`/admin/auctions/${currentAuction._id}`}
              closeFunc={() => toggleSubmitForm('updateForm')}
              parentKey="update1"
              setFunc={setAuction}
              navigate={setTrigger}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AuctionConfig;
