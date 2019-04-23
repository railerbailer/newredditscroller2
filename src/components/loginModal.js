import React, { Component } from "react";
import { Modal, Button, Input, Tooltip, Icon, message } from "antd";

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
        : await firebase.doSignInWithEmailAndPassword(email, password);
      this.setState({
        errorMessagePassword: "",
        errorMessageEmail: "",
        isLoading: false
      });
      this.props.toggleIsModalVisible();
      message.info(`Logged in, you can now add pics and gifs to your collections`);
    } catch (error) {
      console.log(error);
      error.code.includes("password")
        ? this.setState({
            errorMessagePassword: "Wrong password",
            errorMessageEmail: "",
            isLoading: false
          })
        : this.setState({
            errorMessageEmail: error.code.includes("auth/invalid-email") ? "Use your e-mail" : "User email not found",
            errorMessagePassword: "",
            isLoading: false
          });
    }
  };
  cancelModal;
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
        zIndex={123123}
        confirmLoading={isLoading}
        title={registerMode ? "Register" : "Login"}
        wrapClassName="loginModal"
        centered
        visible={this.props.isModalVisible}
        onOk={() => this.submitForm()}
        onCancel={this.props.toggleIsModalVisible}
      >
        <Input
          placeholder="Enter your email"
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

        {errorMessageEmail}
        {this.state.registerMode && (
          <Input
            placeholder="Pick a user name (optional)"
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
        )}
        {errorMessageUserName}
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

        {errorMessagePassword}
        {this.state.registerMode && (
          <React.Fragment>
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
      </Modal>
    );
  }
}
export default LoginModal;
