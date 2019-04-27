import React, { Component } from "react";
import { Modal, Button, Input, Tooltip, Icon, message } from "antd";
import PrivacyPolicy from "../terms/privacyPolicy";

class LoginModal extends Component {
  state = {
    email: "",
    userName: "",
    password: "",
    secondPassword: "",
    errorMessageEmail: "",
    errorMessagePassword: "",
    registerMode: false,
    errorMessageMatchingPassword: ""
  };

  submitForm = async () => {
    const { secondPassword, password, email, registerMode, userName } = this.state;
    const { firebase } = this.props;
    this.setState({
      errorMessagePassword: "",
      errorMessageEmail: "",
      errorMessageMatchingPassword: "",
      errorMessageUserName: ""
    });
    if (registerMode && secondPassword !== password) {
      this.setState({ errorMessageMatchingPassword: "Passwords not matching" });
      return;
    }
    if (registerMode && !userName.length) {
      this.setState({ errorMessageUserName: "User name required" });
      return;
    }
    try {
      this.setState({ isLoading: true });
      registerMode
        ? await firebase.doCreateUserWithEmailAndPassword(email, password, userName)
        : await firebase.doSignInWithEmailAndPassword(email, password, userName);
      this.setState({
        errorMessagePassword: "",
        errorMessageUserName: "",
        isLoading: false
      });

      this.props.toggleIsModalVisible();
      message.info(`Logged in, you can now add pics and gifs to your collections`);
    } catch (error) {
      console.log(error);
      error.code.includes("password")
        ? this.setState({
            errorMessagePassword: "Wrong password",
            errorMessageUserName: "",
            isLoading: false
          })
        : this.setState({
            errorMessageUserName: error.code.includes("auth/invalid-email")
              ? "User "
              : this.state.registerMode
              ? "email/username already registered"
              : "User not found",
            errorMessagePassword: "",
            isLoading: false
          });
    }
  };
  render() {
    const {
      isLoading,
      errorMessageEmail,
      errorMessagePassword,
      email,
      userName,
      password,
      registerMode,
      secondPassword,
      errorMessageMatchingPassword,
      errorMessageUserName
    } = this.state;
    return (
      <Modal
        zIndex={999999999999}
        confirmLoading={isLoading}
        title={registerMode ? "Register" : "Login"}
        wrapClassName="loginModal"
        centered
        visible={this.props.isModalVisible}
        onOk={() => this.submitForm()}
        onCancel={this.props.toggleIsModalVisible}
      >
        <div className="registerInputField">
          <Input
            placeholder={registerMode ? "Pick a user name" : "Enter your username or email"}
            prefix={
              <Icon
                type="user"
                style={{
                  color: "rgba(0,0,0,.25)"
                }}
              />
            }
            value={userName}
            onChange={event => this.setState({ userName: event.target.value })}
            suffix={
              <Tooltip title="Choose user name">
                <Icon type="info-circle" style={{ color: "rgba(0,0,0,.25)" }} />
              </Tooltip>
            }
          />
          {registerMode && <span>*</span>}
        </div>
        {errorMessageUserName}
        {registerMode && (
          <div className="registerInputField">
            <Input
              placeholder={"Enter your email (optional)"}
              value={email}
              onChange={event => this.setState({ email: event.target.value })}
              prefix={
                <Icon
                  type="mail"
                  style={{
                    color: !errorMessageEmail.length ? "rgba(0,0,0,.25)" : "red"
                  }}
                />
              }
              suffix={
                <Tooltip title="Extra information">
                  <Icon type="info-circle" style={{ color: "rgba(0,0,0,.25)" }} />
                </Tooltip>
              }
            />
            {registerMode && <span style={{ color: "white" }}>*</span>}
          </div>
        )}
        {errorMessageEmail}
        <div className="registerInputField">
          <Input.Password
            value={password}
            prefix={
              <Icon
                type="lock"
                style={{
                  color: !errorMessagePassword.length ? "rgba(0,0,0,.25)" : "red"
                }}
              />
            }
            onChange={event => this.setState({ password: event.target.value })}
            placeholder="Password"
            onPressEnter={() => this.submitForm()}
          />
          {registerMode && <span>*</span>}
        </div>

        {errorMessagePassword}
        {registerMode && (
          <React.Fragment>
            <div className="registerInputField">
              <Input.Password
                autoFocus
                value={secondPassword}
                prefix={
                  <Icon
                    type={!errorMessageMatchingPassword.length ? "unlock" : "lock"}
                    style={{
                      color: !errorMessageMatchingPassword.length ? "rgba(0,0,0,.25)" : "red"
                    }}
                  />
                }
                onChange={event => this.setState({ secondPassword: event.target.value })}
                placeholder="Confirm password"
                onPressEnter={() => this.submitForm()}
              />
              {registerMode && <span>*</span>}
            </div>
            {errorMessageMatchingPassword}
          </React.Fragment>
        )}
        {/* {errorMessagePassword.length && (
              <a onClick={() => this.resetPassword()}>
                Reset password
              </a>
            )} */}
        {!registerMode && (
          <Button
            style={{ position: "absolute", bottom: "10px", left: "10px" }}
            onClick={() =>
              this.setState({
                registerMode: true,
                errorMessagePassword: "",
                errorMessageEmail: "",
                errorMessageMatchingPassword: "",
                errorMessageUserName: ""
              })
            }
          >
            Register
          </Button>
        )}
        {registerMode && <PrivacyPolicy />}
      </Modal>
    );
  }
}
export default LoginModal;
