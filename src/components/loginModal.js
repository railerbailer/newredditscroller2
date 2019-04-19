import React, { Component } from "react";
import { Modal, Button, Input, Tooltip, Icon, message } from "antd";

class LoginModal extends Component {
  state = {
    userName: "",
    password: "",
    secondPassword: "",
    errorMessageUserName: "",
    errorMessagePassword: "",
    registerMode: false,
    errorMessageMatchingPassword: ""
  };

  submitForm = async () => {
    const { secondPassword, password, userName, registerMode } = this.state;
    const { firebase } = this.props;
    this.setState({
      errorMessagePassword: "",
      errorMessageUserName: "",
      errorMessageMatchingPassword: ""
    });
    if (registerMode && secondPassword !== password) {
      this.setState({ errorMessageMatchingPassword: "Passwords not matching" });
      return;
    }
    try {
      this.setState({ isLoading: true });
      registerMode
        ? await firebase.doCreateUserWithEmailAndPassword(userName, password)
        : await firebase.doSignInWithEmailAndPassword(userName, password);
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
            errorMessageUserName: error.code.includes("auth/invalid-email") ? "Use your e-mail" : "User not found",
            errorMessagePassword: "",
            isLoading: false
          });
    }
  };
  cancelModal;
  render() {
    const {
      isLoading,
      errorMessageUserName,
      errorMessagePassword,
      userName,
      password,
      registerMode,
      secondPassword,
      errorMessageMatchingPassword
    } = this.state;
    return (
      <Modal
        confirmLoading={isLoading}
        title={registerMode ? "Register" : "Login"}
        centered
        visible={this.props.isModalVisible}
        onOk={() => this.submitForm()}
        onCancel={this.props.toggleIsModalVisible}
      >
        <Input
          placeholder="Enter your email"
          prefix={
            <Icon
              type="user"
              style={{
                color: !errorMessageUserName.length ? "rgba(0,0,0,.25)" : "red"
              }}
            />
          }
          value={userName}
          onChange={event => this.setState({ userName: event.target.value })}
          suffix={
            <Tooltip title="Extra information">
              <Icon type="info-circle" style={{ color: "rgba(0,0,0,.25)" }} />
            </Tooltip>
          }
        />

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
              value={secondPassword}
              prefix={
                <Icon
                  type={!errorMessageMatchingPassword.length ? "lock" : "unlock"}
                  style={{
                    color: !errorMessageMatchingPassword.length ? "rgba(0,0,0,.25)" : "red"
                  }}
                />
              }
              onChange={event => this.setState({ secondPassword: event.target.value })}
              placeholder="Confirm password"
              onPressEnter={() => this.submitForm()}
            />
            >{errorMessageMatchingPassword}
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
            onClick={() => this.setState({ registerMode: true })}
          >
            Register
          </Button>
        )}
      </Modal>
    );
  }
}

// firebase.doSignInWithEmailAndPassword("sumsar@live.com", "whatever");
// firebase.readDataOnUser();

// firebase.updateDataOnUser({
//   whatever: "trueNOT",
//   image: ["first image", "secondImage", "third", "fouasdasdrtgh", "fith"]
// });
export default LoginModal;
