import React from 'react';
import SubmitForm from '../../components/common/SubmitForm';

const New = () => {
  return (
    <div className="inputFormContainerRoot d-flex justify-content-center mt-5">
      <SubmitForm modelKey = {'auction'} neglects = {[]} postUrl = "/auction" navigate="/auctions" />
    </div>
  );
};

export default New;
