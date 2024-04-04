import React, { useEffect, useState } from "react";
import settings from "../../config/settings";
import "./styles.css";
import { useNavigate } from "react-router";
import encrypt from "../../components/common/Encrypt";

const Admin = () => {
  const [selectedOption, setSelectedOption] = useState("admin");
  const [patValue, setPatValue] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handlePatChange = (event) => {
    setPatValue(event.target.value);
  };

  const login = async () => {
    const resp = await (
      await fetch(`${settings.BaseUrl}/auth/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: encrypt(password) }),
        credentials: "include",
      })
    ).json();
    if (resp.status) {
      navigate("/view/admin", { state: { fromAdmin: true } });
    } else if (resp.errorCode === 601) {
      navigate("/view/admin", { state: { fromAdmin: true } });
    } else {
      window.alert(`${resp.errorCode} : ${resp.data}`);
    }
  };
  const loadAdmin = async () => {
    const resp = await (
      await fetch(`${settings.BaseUrl}/admin`, { credentials: "include" })
    ).json();
    if (resp.errorCode == 601) {
      navigate("/view/admin", { state: { fromAdmin: true } });
    }
  };
  useEffect(() => {
    loadAdmin();
  }, []);

  return (
    <div>
      <form className="admin-form mt-5">
        <div className="admin-options">
          <button
            type="button"
            className={`admin-option ${selectedOption === "admin" ? "selected" : ""}`}
            onClick={() => handleOptionChange("admin")}
          >
            Admin
          </button>
          <button
            type="button"
            className={`admin-option ${selectedOption === "pat" ? "selected" : ""}`}
            onClick={() => handleOptionChange("pat")}
          >
            PAT
          </button>
        </div>

        {selectedOption === "admin" ? (
          <div>
            <label htmlFor="password">Password:</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="pat">PAT:</label>
            <input
              type="text"
              id="pat"
              value={patValue}
              onChange={handlePatChange}
            />
          </div>
        )}

        <button type="button" onClick={login} className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Admin;
