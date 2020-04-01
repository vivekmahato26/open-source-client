import React, { createContext, Component } from "react";

export const AuthContext = createContext();

class AuthContextProvider extends Component {
  state = {
    token: null,
    userId: null
  };
  login = (userId, token) => {
    this.setState({
      token: token,
      userId: userId
    });
  };
  logout = () => {
    this.setState({
      token: null,
      userId: null
    });
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.reload();
  };
  render() {
    return (
      <AuthContext.Provider
        value={{ ...this.state, login: this.login, logout: this.logout }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContextProvider;
