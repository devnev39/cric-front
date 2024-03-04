import teamApi from "../../api/team";
import React, { useState } from "react";
import * as Yup from "yup";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTypography,
} from "mdb-react-ui-kit";
import { Formik } from "formik";
import { addTeam, removeTeam, updateTeam } from "../../feature/team";

function Teams(props) {
  // Fetch team data and set to store if not set
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  const teams = useSelector((state) => state.team.teams);
  const auction = useSelector((state) => state.auction.auction);

  const [isUpdating, setIsUpdating] = useState(false);

  const [updatingTeam, setUpdatingTeam] = useState({ name: "", budget: "" });

  const resetUpdatingTeam = () => {
    setUpdatingTeam({ name: "", budget: "" });
    setIsUpdating(false);
  };

  const dispatch = useDispatch();

  const abortController = new AbortController();
  const signal = abortController.signal;

  const teamTableColumns = [
    "#",
    "Name",
    "Current Budget",
    "Max Budget",
    "Actions",
  ];

  const addNewTeam = (values, { setSubmitting }) => {
    if (isUpdating) {
      teamApi
          .updateTeam(updatingTeam._id, values, signal)
          .then((resp) => resp.json())
          .then((resp) => {
            if (resp.status) {
              dispatch(updateTeam(resp.data));
            } else {
              window.alert(`${resp.errorCode} : ${resp.data}`);
            }
            setSubmitting(false);
            resetUpdatingTeam();
            toggleOpen();
          });
    } else {
      teamApi
          .addTeam({ ...values, auctionId: auction._id }, signal)
          .then((resp) => resp.json())
          .then((resp) => {
            if (resp.status) {
              dispatch(addTeam(resp.data));
            } else {
              window.alert(`${resp.errorCode} : ${resp.data}`);
            }
            setSubmitting(false);
            resetUpdatingTeam();
            toggleOpen();
          });
    }
  };

  const deleteTeam = (id) => {
    if (!window.confirm("Confirm to delete the team ?")) return;
    teamApi
        .deleteTeam(id, signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status) {
            dispatch(removeTeam(id));
          } else {
            window.alert(`${resp.errorCode} : ${resp.data}`);
          }
        });
  };

  const updateTeamClicked = (id) => {
    const team = teams.filter((t) => t._id == id);
    if (team.length) {
      setIsUpdating(true);
      setUpdatingTeam(team[0]);
      toggleOpen();
    } else {
      window.alert("No team found !");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center teamsContainer mt-4">
        <MDBTypography className="display-6">Teams</MDBTypography>
      </div>
      <hr className="hr" />
      <div className="d-flex justify-content-center">
        <div className="border rounded">
          <MDBTable responsive striped>
            <MDBTableHead>
              <tr>
                {teamTableColumns.map((t) => (
                  <td key={t}>{t}</td>
                ))}
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {teams.map((team) => (
                <tr key={team._id}>
                  <td>{teams.indexOf(team) + 1}</td>
                  <td>{team.name}</td>
                  <td>{team.currentBudget}</td>
                  <td>{team.budget}</td>
                  <td>
                    <MDBBtn
                      className="text-primary"
                      color="link"
                      rounded
                      size="sm"
                      onClick={() => updateTeamClicked(team._id)}
                    >
                      Update
                    </MDBBtn>
                    <MDBBtn
                      className="text-danger"
                      color="link"
                      rounded
                      size="sm"
                      onClick={() => deleteTeam(team._id)}
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
      <div className="d-flex justify-content-center my-3">
        <MDBBtn size="sm" onClick={toggleOpen}>
          Add Team
        </MDBBtn>
      </div>
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex="100">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add Team</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Formik
                initialValues={updatingTeam}
                validationSchema={Yup.object({
                  name: Yup.string().required("Required !"),
                  budget: Yup.number().required("Required !"),
                })}
                onSubmit={addNewTeam}
                enableReinitialize
              >
                {(formik) => (
                  <form id="teamForm" onSubmit={formik.handleSubmit}>
                    <MDBInput
                      className="my-2"
                      id="teamName"
                      label="Name"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <MDBTypography note noteColor="danger">
                        {formik.errors.name}
                      </MDBTypography>
                    ) : null}
                    <MDBInput
                      type="number"
                      className="my-2"
                      id="teamBudget"
                      label="Budget"
                      {...formik.getFieldProps("budget")}
                    />
                    {formik.touched.budget && formik.errors.budget ? (
                      <MDBTypography note noteColor="danger">
                        {formik.errors.budget}
                      </MDBTypography>
                    ) : null}
                  </form>
                )}
              </Formik>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => {
                  resetUpdatingTeam();
                  toggleOpen();
                }}
              >
                Close
              </MDBBtn>
              <MDBBtn type="submit" form="teamForm">
                {isUpdating ? "Update" : "Add"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default Teams;
