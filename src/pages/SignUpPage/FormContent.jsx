import React, { useRef, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import { createAccountWithEmailAndPassword } from "../../scripts/firebase/authentication/authentication";

export default function FormContent() {
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({
    title: "",
    code: "",
    message: "",
    delay: 0,
    position: "top-end",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handlePasswordToggle = (e, ref) => {
    if (ref.current.type === "password") {
      ref.current.type = "text";
    } else {
      ref.current.type = "password";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let toastData = {};
    const regex = /^[a-z0-9_]{1,15}$/;

    if (!regex.test(username)) {
      toastData = {
        title: "Invalid username",
        code: "",
        message: "Username can only contain letters, numbers and underscores.",
        delay: 6000,
        position: "top-end",
      };
      setToastContent(toastData);
      setShowToast(true);
      return;
    }

    if (password.length < 6) {
      toastData = {
        title: "Password too short",
        code: "",
        message: "Password should be 6 or more characters.",
        delay: 6000,
        position: "top-end",
      };
      setToastContent(toastData);
      setShowToast(true);
      return;
    }

    if (password !== confirmPassword) {
      toastData = {
        title: "Passwords don't match",
        code: "",
        message: "Please check your passwords again.",
        delay: 6000,
        position: "top-end",
      };
      setToastContent(toastData);
      setShowToast(true);
      return;
    }

    const authResponse = await createAccountWithEmailAndPassword(
      name,
      email,
      username,
      password
    );
    if (authResponse.user) {
      setUser(authResponse.user);
      console.log("firebase-auth-user:", authResponse.user);
      alert("Account created successfully");
    }
    if (authResponse.error) {
      console.log(authResponse.error.code);
      if (authResponse.error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else {
        alert("hello");
      }
    }
  };
  // why getting eslint error near labels?
  return (
    <>
      <form className="needs-validation" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-6">
            <div className="position-relative mb-4">
              <label htmlFor="name" className="form-label fs-base">
                Full name
              </label>
              <input
                type="text"
                id="name"
                className="form-control form-control-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="invalid-feedback position-absolute start-0 top-100">
                Please enter your name!
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="position-relative mb-4">
              <label htmlFor="email" className="form-label fs-base">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control form-control-lg"
                required
              />
              <div className="invalid-feedback position-absolute start-0 top-100">
                Please enter a valid email address!
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="position-relative mb-4">
              <label htmlFor="username" className="form-label fs-base">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control form-control-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="invalid-feedback position-absolute start-0 top-100">
                Please enter your username!
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <label htmlFor="password" className="form-label fs-base">
              Password
            </label>
            <div className="password-toggle">
              <input
                type="password"
                id="password"
                className="form-control form-control-lg"
                ref={passwordRef}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                className="password-toggle-btn"
                aria-label="Show/hide password"
              >
                <input
                  className="password-toggle-check"
                  type="checkbox"
                  onClick={(e) => handlePasswordToggle(e, passwordRef)}
                />
                <span className="password-toggle-indicator" />
              </label>
              <div className="invalid-feedback position-absolute start-0 top-100">
                Please enter a password!
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <label htmlFor="password-confirm" className="form-label fs-base">
              Confirm password
            </label>
            <div className="password-toggle">
              <input
                type="password"
                id="password-confirm"
                className="form-control form-control-lg"
                ref={confirmPasswordRef}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label
                className="password-toggle-btn"
                aria-label="Show/hide password"
              >
                <input
                  className="password-toggle-check"
                  type="checkbox"
                  onClick={(e) => handlePasswordToggle(e, confirmPasswordRef)}
                />
                <span className="password-toggle-indicator" />
              </label>
              <div className="invalid-feedback position-absolute start-0 top-100">
                Please enter a password!
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary shadow-primary btn-lg w-100"
        >
          Sign up
        </button>
      </form>
      <Row>
        <Col xs={6}>
          <ToastContainer position="top-end" className="p-3">
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={toastContent.delay}
              position={toastContent.position}
              autohide
            >
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">{toastContent.title}</strong>
                <small>{toastContent.code}</small>
              </Toast.Header>
              <Toast.Body>{toastContent.message}</Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </>
  );
}
