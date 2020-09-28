import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import * as nearApi from 'near-api-js';
import { KeyPair } from 'near-api-js';
import {
  nearTo, nearToInt, toNear, BOATLOAD_OF_GAS, DROP_GAS, NETWORK_ID, ACCESS_KEY_ALLOWANCE
} from './util/near-util';
import nearlogo from './assets/gray_near_logo.svg';

class Claim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secretkey: null,
      amount: 0,
    }
  }

  async componentDidMount() {
    const {
        contractName,
        walletUrl
    } = window.nearConfig

    if (this.props.match.params) {
      try {
        const secretkey = this.props.match.params.key
        let amount = 0
        amount = await this.checkNearDropBalance(contractName, secretkey)
        this.setState({ secretkey, amount })
        console.log(contractName, secretkey, amount)

      } catch (err) {
        console.log(err)
      }
    }
  }


  async checkNearDropBalance(fundingContract, fundingKey) {
    const account = this.getAccount(fundingContract)

    const contract = new nearApi.Contract(account, fundingContract, {
        viewMethods: ['get_key_balance'],
        sender: fundingContract
    });
    
    const key = KeyPair.fromString(fundingKey).publicKey.toString()
    return await contract.get_key_balance({ key })
  }

  getAccount(accountId) {
    return new nearApi.Account(window.near.connection, accountId)
  }

  render() {
    const { secretkey, amount } = this.state;
    
    return (
      <div className="App-header">
        <div className="image-wrapper">
          <img className="logo" src={nearlogo} alt="NEAR logo" height="60" />
        </div>
        <div>
          {secretkey}
          <br/>
          {nearTo(amount, 2)} Ⓝ
        </div>
      </div>
    )
  }

}

export default Claim;
