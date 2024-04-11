import React from "react";
import auctionApi from "../../api/auction";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useContext } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardText,
  MDBInput,
  MDBTypography,
} from "mdb-react-ui-kit";
import { Formik } from "formik";
import { useNavigate } from "react-router";
import encrypt from "../../components/common/Encrypt";
import Footer from "../Footer";
import { AlertContext } from "../../context/AlertContext";

const New = () => {
  const controller = new AbortController();
  const signal = controller.signal;
  const navigate = useNavigate();
  const { showMessage } = useContext(AlertContext);
  const submitNewAuction = (values) => {
    const adminId = encrypt(values.adminId);
    delete values.adminId;
    values.password = encrypt(values.password);
    values.createdAt = dayjs().toISOString();

    auctionApi
        .createAuction(adminId, values, signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status) {
            showMessage("Success !");
            navigate("/");
          } else {
            showMessage(`${resp.errorCode} : ${resp.data}`, "error");
          }
        })
        .catch((err) => {
          showMessage(err);
        });
  };
  return (
    <>
      <div className="mt-5 w-100">
        <div className="d-flex justify-content-center">
          <MDBCard className="p-5 w-50">
            <MDBCardText>
              <div className="d-flex justify-content-center">
                <MDBTypography className="display-6">New Auction</MDBTypography>
              </div>
            </MDBCardText>
            <MDBCardBody>
              <Formik
                initialValues={{
                  name: "",
                  budget: null,
                  password: "",
                  adminId: "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string().required("Required !"),
                  budget: Yup.number().required("Required !"),
                  password: Yup.string().required("Required !"),
                  adminId: Yup.string().required("Required !"),
                })}
                onSubmit={(values) => submitNewAuction(values)}
              >
                {(formik) => (
                  <form id="auctionForm" onSubmit={formik.handleSubmit}>
                    <MDBInput
                      id="name"
                      className="my-2"
                      label="Auction Name"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <MDBTypography note noteColor="danger">
                        Required
                      </MDBTypography>
                    ) : null}
                    <MDBInput
                      id="budget"
                      className="my-2"
                      label="Budget"
                      type="number"
                      {...formik.getFieldProps("budget")}
                    />
                    {formik.touched.budget && formik.errors.budget ? (
                      <MDBTypography note noteColor="danger">
                        Required
                      </MDBTypography>
                    ) : null}
                    <MDBInput
                      id="password"
                      className="my-2"
                      label="Password"
                      type="password"
                      {...formik.getFieldProps("password")}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <MDBTypography note noteColor="danger">
                        Required
                      </MDBTypography>
                    ) : null}
                    <MDBInput
                      id="adminId"
                      className="my-2"
                      label="Admin Id"
                      type="password"
                      {...formik.getFieldProps("adminId")}
                    />
                    {formik.touched.adminId && formik.errors.adminId ? (
                      <MDBTypography note noteColor="danger">
                        Required
                      </MDBTypography>
                    ) : null}
                  </form>
                )}
              </Formik>
            </MDBCardBody>
            <MDBCardFooter>
              <div className="d-flex justify-content-center">
                <MDBBtn form="auctionForm" type="submit">
                  Submit
                </MDBBtn>
              </div>
            </MDBCardFooter>
          </MDBCard>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default New;
