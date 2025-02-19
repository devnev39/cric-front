import dayjs from "dayjs";
import { Field, Formik } from "formik";
import {
  MDBBtn,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBTypography,
} from "mdb-react-ui-kit";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import auction from "../../api/auction";
import { removeAuction, updateAuctions } from "../../feature/auction";
import { AlertContext } from "../../context/AlertContext";

const AuctionConfig = () => {
  const auctions = useSelector((state) => state.auction.auctions);
  const [updatingAuction, setUpdatingAuction] = useState(null);

  const [basicModal, setBasicModal] = useState(false);

  const { showMessage } = useContext(AlertContext);

  const toggleOpen = () => {
    setBasicModal(!basicModal);
    setUpdatingAuction(null);
  };

  const signal = new AbortController().signal;

  const dispatch = useDispatch();

  const updateAuctionClicked = (id) => {
    const auction = auctions.filter((a) => a._id == id)[0];
    if (auction) {
      toggleOpen();
      setUpdatingAuction(auction);
    } else {
      showMessage("Auction not found !", "error");
    }
  };

  const updateAuction = (values, setSubmitting) => {
    setSubmitting(true);
    console.log(values);
    auction
        .updateAuctionAdmin(values, signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status) {
            dispatch(updateAuctions(resp.data));
            toggleOpen();
          } else {
            showMessage(`${resp.errorCode} : ${resp.data}`, "error");
          }
        })
        .catch((err) => {
          showMessage(`${err}`, "error");
        })
        .finally(() => {
          setSubmitting(false);
        });
  };

  const deleteAuction = (id) => {
    if (
      !window.confirm(
          "This auction will be permanently deleted ! Proceed further ?",
      )
    ) {
      return;
    }
    auction
        .deleteAuctionAdmin({ _id: id }, signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status) {
            showMessage("Auction deleted !");
            dispatch(removeAuction({ _id: id }));
          } else {
            showMessage(`${resp.errorCode} : ${resp.data}`, "error");
          }
        })
        .catch((err) => {
          showMessage(`${err}`, "error");
        });
  };
  return (
    <>
      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <div className="border rounded mt-3">
              <MDBTable>
                <MDBTableHead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Allow Login</th>
                    <th scope="col">Allow Public Team View</th>
                    <th scope="col">Allow Real Time Updates</th>
                    <th scope="col">Freeze</th>
                    <th scope="col">Max Players</th>
                    <th scope="col">Max Budget</th>
                    <th scope="col">Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {auctions.length ?
                    auctions.map((a) => (
                      <tr key={a._id}>
                        <td>{auctions.indexOf(a) + 1}</td>
                        <td>{a.name}</td>
                        <td>
                          {dayjs(a.createdAt).toDate().toLocaleString()}
                        </td>
                        <td>
                          <MDBCheckbox disabled checked={a.allowLogin} />
                        </td>
                        <td>
                          <MDBCheckbox
                            disabled
                            checked={a.allowPublicTeamView}
                          />
                        </td>
                        <td>
                          <MDBCheckbox
                            disabled
                            checked={a.allowRealtimeUpdates}
                          />
                        </td>
                        <td>
                          <MDBCheckbox disabled checked={a.freeze} />
                        </td>
                        <td>{a.maxPlayers}</td>
                        <td>{a.maxBudget}</td>
                        <td>
                          <MDBBtn
                            className="text-primary"
                            color="link"
                            rounded
                            size="sm"
                            onClick={() => updateAuctionClicked(a._id)}
                          >
                              Update
                          </MDBBtn>
                          <MDBBtn
                            className="text-danger"
                            color="link"
                            rounded
                            size="sm"
                            onClick={() => deleteAuction(a._id)}
                          >
                              Delete
                          </MDBBtn>
                        </td>
                      </tr>
                    )) :
                    null}
                </MDBTableBody>
              </MDBTable>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update Auction</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Formik
                initialValues={updatingAuction}
                enableReinitialize
                onSubmit={(values, { setSubmitting }) =>
                  updateAuction(values, setSubmitting)
                }
              >
                {(formik) => (
                  <form id="auctionForm" onSubmit={formik.handleSubmit}>
                    <MDBInput
                      id="Name"
                      label="Name"
                      className="my-2"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <MDBTypography note noteColor="danger">
                        {formik.errors.name}
                      </MDBTypography>
                    ) : null}
                    <MDBInput
                      id="Status"
                      label="Status"
                      className="my-2"
                      {...formik.getFieldProps("status")}
                    />
                    {formik.touched.status && formik.errors.status ? (
                      <MDBTypography note noteColor="danger">
                        {formik.errors.status}
                      </MDBTypography>
                    ) : null}
                    <div>
                      <Field
                        className="mx-2"
                        type="checkbox"
                        name="allowLogin"
                      />
                      <label>Allow Login</label>
                      {formik.touched.allowLogin && formik.errors.allowLogin ? (
                        <MDBTypography note noteColor="danger">
                          {formik.errors.allowLogin}
                        </MDBTypography>
                      ) : null}
                    </div>
                    {/* <MDBCheckbox label='Allow Real Time Updates' checked={formik.initialValues.allowRealtimeUpdates} /> */}
                    <div>
                      <Field
                        className="mx-2"
                        type="checkbox"
                        name="allowPublicTeamView"
                      />
                      <label>Allow Public Team View</label>
                      {formik.touched.allowPublicTeamView &&
                      formik.errors.allowPublicTeamView ? (
                        <MDBTypography note noteColor="danger">
                          {formik.errors.allowPublicTeamView}
                        </MDBTypography>
                      ) : null}
                    </div>
                    <div>
                      <Field
                        className="mx-2"
                        type="checkbox"
                        name="allowRealtimeUpdates"
                      />
                      <label>Allow Real Time Updates</label>
                      {formik.touched.allowRealtimeUpdates &&
                      formik.errors.allowRealtimeUpdates ? (
                        <MDBTypography note noteColor="danger">
                          {formik.errors.allowRealtimeUpdates}
                        </MDBTypography>
                      ) : null}
                    </div>
                    <div>
                      <Field className="mx-2" type="checkbox" name="freeze" />
                      <label>Freeze</label>
                      {formik.touched.freeze && formik.errors.freeze ? (
                        <MDBTypography note noteColor="danger">
                          {formik.errors.freeze}
                        </MDBTypography>
                      ) : null}
                    </div>
                  </form>
                )}
              </Formik>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn type="submit" form="auctionForm">
                Update
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default AuctionConfig;
