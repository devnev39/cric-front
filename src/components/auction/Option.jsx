import React, { useState, useContext } from "react";
import * as Yup from "yup";
import auctionApi from "../../api/auction";
import ruleApi from "../../api/rule";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Field, Formik } from "formik";
import {
  MDBBtn,
  MDBCheckbox,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBSpinner,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTypography,
} from "mdb-react-ui-kit";
import { updateAuction } from "../../feature/auction";
import { removeRule, updateRules } from "../../feature/rule";
import { AlertContext } from "../../context/AlertContext";

const selectAuction = (state) => state.auction.auction;
const selectRules = (state) => state.rule.rules;

function Option(props) {
  // Show update options for auction
  // Show rules section at the bottom
  const abortController = new AbortController();
  const signal = abortController.signal;

  const a = useSelector(selectAuction);
  const rules = useSelector(selectRules);

  const sampleRules = useSelector((state) => state.rule.sampleRules);

  const ruleTableColums = ["#", "Name", "Type", "Rule", "Actions"];
  const dispatch = useDispatch();

  const [auctionEditEnabled, setAuctionEditEnabled] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const { showMessage } = useContext(AlertContext);

  const toggleOpen = () => setBasicModal(!basicModal);

  const updateAuctionParams = (values, { setSubmitting }) => {
    auctionApi
        .updateAuction(values, signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status && resp.data) {
            dispatch(updateAuction(values));
            setSubmitting(false);
            setAuctionEditEnabled(false);
          } else {
            showMessage(`${resp.errorCode} : ${resp.data}`, "error");
            setSubmitting(false);
          }
        })
        .catch((err) => {
          showMessage(`${err}`, "error");
          setSubmitting(false);
        });
  };

  const addNewRule = (values, { setSubmitting }) => {
    if (setSubmitting) setSubmitting(true);
    ruleApi
        .addRule({ ...values, auctionId: a._id }, signal)
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            dispatch(updateRules(res.data));
            if (setSubmitting) toggleOpen();
          } else {
            showMessage(`${res.errorCode} : ${res.dat}`);
          }
        })
        .catch((err) => {
          showMessage(`${err}`, "error");
        })
        .finally(() => {
          if (setSubmitting) setSubmitting(false);
        });
  };

  const deleteRule = (id) => {
    ruleApi
        .deleteRule(id, signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status) {
            dispatch(removeRule(id));
          } else {
            showMessage(`${resp.errorCode} : ${resp.data}`, "error");
          }
        });
  };

  return (
    <>
      <div className="optionContainerRoot" id="optionMainDiv">
        <div className="d-flex justify-content-center mt-3">
          <MDBTypography className="display-6">Auction Options</MDBTypography>
        </div>
        <hr className="hr" />
        <div className="d-flex justify-content-center">
          <Formik
            initialValues={a}
            enableReinitialize
            onSubmit={updateAuctionParams}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <MDBInput
                  className="my-3"
                  id="maxBudget"
                  label="Max Budget"
                  type="number"
                  {...formik.getFieldProps("maxBudget")}
                  disabled={!auctionEditEnabled}
                />
                <MDBInput
                  className="my-3"
                  id="maxPlayers"
                  label="Max Players"
                  type="number"
                  {...formik.getFieldProps("maxPlayers")}
                  disabled={!auctionEditEnabled}
                />
                <MDBInput
                  className="my-3"
                  id="priceUnit"
                  label="Price Unit"
                  type="text"
                  {...formik.getFieldProps("priceUnit")}
                  disabled={!auctionEditEnabled}
                />
                <MDBCheckbox
                  id="allowPublicTeamView"
                  label="Allow Public Team View"
                  checked={formik.values.allowPublicTeamView}
                  onChange={formik.handleChange}
                  disabled={!auctionEditEnabled}
                />
                <MDBCheckbox
                  id="allowRealtimeUpdates"
                  label="Allow Realtime Updates"
                  checked={formik.values.allowRealtimeUpdates}
                  onChange={formik.handleChange}
                  disabled={!auctionEditEnabled}
                />
                <div className="d-flex justify-content-center mt-5">
                  <MDBBtn
                    className="mx-3"
                    type="button"
                    onClick={() => setAuctionEditEnabled(!auctionEditEnabled)}
                  >
                    Update
                  </MDBBtn>
                  <MDBBtn
                    className="mx-3"
                    disabled={
                      JSON.stringify(a) === JSON.stringify(formik.values)
                    }
                    outline
                    type="submit"
                  >
                    {formik.isSubmitting ? (
                      <MDBSpinner role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                      </MDBSpinner>
                    ) : (
                      "Save"
                    )}
                  </MDBBtn>
                </div>
              </form>
            )}
          </Formik>
        </div>
        <hr className="hr" />
        <div className="rulesContainer mt-4">
          <div className="d-flex justify-content-center">
            <MDBTypography className="display-6">Rules</MDBTypography>
          </div>
          <hr className="hr" />
          <div className="d-flex justify-content-center">
            <div className="rounded border">
              <MDBTable align="middle" striped>
                <MDBTableHead>
                  <tr>
                    {ruleTableColums.map((cln) => (
                      <th scope="col" key={cln}>
                        {cln}
                      </th>
                    ))}
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {rules.map((rule) => (
                    <tr key={rules.indexOf(rule)}>
                      <td>{rules.indexOf(rule) + 1}</td>
                      <td>{rule.name}</td>
                      <td>{rule.type}</td>
                      <td>{rule.rule}</td>
                      <td>
                        <MDBBtn
                          onClick={() => deleteRule(rule._id)}
                          color="link"
                          className="text-danger"
                          rounded
                          size="sm"
                        >
                          Delete
                        </MDBBtn>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <MDBBtn onClick={toggleOpen} size="sm" className="mt-3">
              Add Rule
            </MDBBtn>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <MDBTypography variant="h5">
              Rules used by another auctions
            </MDBTypography>
          </div>
          <div className="d-flex justify-content-center">
            <div
              className="border rounded overflow-auto"
              style={{ maxHeight: "50vh" }}
            >
              <MDBTable align="middle" striped>
                <MDBTableHead>
                  <tr>
                    {ruleTableColums.map((cln) => (
                      <th scope="col" key={cln}>
                        {cln}
                      </th>
                    ))}
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {sampleRules.map((rule) => (
                    <tr key={rules.indexOf(rule)}>
                      <td>
                        <MDBIcon color="info" fas icon="star" />
                      </td>
                      <td>{rule.name}</td>
                      <td>{rule.type}</td>
                      <td>{rule.rule}</td>
                      <td>
                        <MDBBtn
                          onClick={() =>
                            addNewRule(
                                { ...rule, _id: undefined },
                                { setSubmitting: undefined },
                            )
                          }
                          color="link"
                          className="text-success"
                          rounded
                          size="sm"
                        >
                          Add
                        </MDBBtn>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </div>
          </div>
          <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex="-1">
            <MDBModalDialog>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Add Rule</MDBModalTitle>
                  <MDBBtn className="btn-close" onClick={toggleOpen}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  <Formik
                    validationSchema={Yup.object({
                      name: Yup.string().required("Required"),
                      rule: Yup.string().required("Required"),
                      type: Yup.string().required("Required"),
                    })}
                    initialValues={{
                      name: "",
                      rule: "",
                      type: "",
                    }}
                    onSubmit={addNewRule}
                    enableReinitialize
                  >
                    {(frm) => (
                      <form id="ruleForm" onSubmit={frm.handleSubmit}>
                        <Field
                          as="select"
                          id="ruleType"
                          {...frm.getFieldProps("type")}
                        >
                          <option value="">--Please choose an option--</option>
                          <option value={"player"}>Player</option>
                          <option selected value={"team"}>
                            Team
                          </option>
                        </Field>
                        {frm.touched.type && frm.errors.type ? (
                          <MDBTypography note noteColor="danger">
                            {frm.errors.type}
                          </MDBTypography>
                        ) : null}
                        {frm.values.type ? (
                          <MDBTypography note noteColor="info">
                            {frm.values.type == "team" ?
                              `Available fields: budget, currentBudget` :
                              `Availabel fields: soldPrice, auctionedPrice, basePrice`}
                          </MDBTypography>
                        ) : null}
                        <MDBInput
                          className="my-2"
                          id="ruleName"
                          label="Name"
                          {...frm.getFieldProps("name")}
                        />
                        {frm.touched.name && frm.errors.name ? (
                          <MDBTypography note noteColor="danger">
                            {frm.errors.name}
                          </MDBTypography>
                        ) : null}
                        <MDBInput
                          className="my-2"
                          id="ruleText"
                          label="Rule"
                          {...frm.getFieldProps("rule")}
                        />
                        {frm.touched.rule && frm.errors.rule ? (
                          <MDBTypography note noteColor="danger">
                            {frm.errors.rule}
                          </MDBTypography>
                        ) : null}
                      </form>
                    )}
                  </Formik>
                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={toggleOpen}>
                    Close
                  </MDBBtn>
                  <MDBBtn type="submit" form="ruleForm">
                    Add
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </div>
      </div>
    </>
  );
}

export default Option;
