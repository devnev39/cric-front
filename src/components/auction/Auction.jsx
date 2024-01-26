import React from 'react';
import {useNavigate} from 'react-router-dom';

export function Auction(props) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="border d-flex align-items-center justify-content-center"
        style={{height: '100vh'}}
      >
        <button
          type="button"
          className="btn btn-success"
          onClick={() => navigate(`/auction/view/${props.auctionObj._id}`)}
        >
          Open Auction View
        </button>
      </div>
    </>
  );
}
