import React from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

function Users() {
  const users = useSelector((state) => state.users.users);
  return (
    <>
      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <MDBCard className="mt-3">
              <MDBCardBody>
                <MDBCardText>
                  <div className="d-flex justify-content-center">
                    <MDBTypography className="display-6">Users</MDBTypography>
                  </div>
                </MDBCardText>
                <div className="d-flex justify-content-center">
                  <div className="border rounded">
                    <MDBTable>
                      <MDBTableHead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Expiry</th>
                          <th scope="col">Enabled</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {users.map((u) => (
                          <tr key={u.pat}>
                            <td>{users.indexOf(u) + 1}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.expiry}</td>
                            <td>{u.enabled}</td>
                            <td>
                              <MDBBtn
                                color="link"
                                className="btn btn-success mx-1"
                              >
                                Update
                              </MDBBtn>
                              <MDBBtn
                                color="link"
                                className="btn btn-success mx-1"
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
                <div className="d-flex justify-content-center mt-3">
                  <MDBBtn className="btn btn-success">Add User</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default Users;
