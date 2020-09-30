import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import nearlogo from './assets/gray_near_logo.svg';
import User from './User';
import Drops from './Drops';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.currentUser,
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
    this.setState({ currentUser: window.currentUser })
  }

  async signedInFlow() {
    this.setState({
      login: true,
    })
    const accountId = await this.props.wallet.getAccountId()
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
  }

  async requestSignIn() {
    const appTitle = 'NEAR Red Envelope';
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    )
  }

  async updateUser() {
    await window.getCurrentUser()
    this.setState({ currentUser: window.currentUser })
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn())
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    this.setState({
      login: false,
      currentUser: null,
    })
  }

  render() {

    const {
      state,
      updateUser
    } = this
    const {
      currentUser
    } = state

    console.log(state)

    return (
      <div className="near-container">
        <div className="near-dapp">
          <div className="near-dapp-header">
            <div className="near-logo">
              <img className="logo" src={nearlogo} alt="NEAR logo" height="40" />
            </div>
            <div className="near-user">
              { currentUser && <User {...{currentUser, updateUser}} />}
            </div>
          </div>
          <div className="near-dapp-body">
            <div>
              { currentUser && <Drops {...{currentUser, updateUser}} />}
            </div>
          </div>
          <div className="near-dapp-footer">
            <div className="login">
              {this.state.login ? 
                <div>
                  <button className="btn" onClick={this.requestSignOut}>Log out</button>
                </div>
                : <button className="btn" onClick={this.requestSignIn}>Log in with NEAR</button>}
            </div>
          </div>
        </div>
        
        
      </div>
    )
  }

}

export default App;
