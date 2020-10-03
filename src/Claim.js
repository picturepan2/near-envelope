import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import * as nearApi from 'near-api-js';
import { KeyPair } from 'near-api-js';
import {
  nearTo, nearToInt, toNear, BOATLOAD_OF_GAS, DROP_GAS, NETWORK_ID, ACCESS_KEY_ALLOWANCE
} from './util/near-util';
import nearcover from './assets/img/redenvelope-cover.svg';

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
      <div className="near-container">
        <div className="near-dapp near-dapp-redenvelope active">
          <div className="near-redenvelope-header">
            <img className="redenvelope-cover" src={nearcover} alt="红包封面图" />
            <button className="redenvelope-btn">拆封</button>
            <div className="redenvelope-card">
              <img className="redenvelope-cover" src={nearcover} alt="红包封面图" />
              <div className="redenvelope-card-header">
                <div className="h2">中秋快乐</div></div>
              <div className="redenvelope-card-body">
                <div className="">金额</div>
                <div className="h1">{nearTo(amount, 2)}<small>Ⓝ</small></div>
              </div>
              <div className="redenvelope-card-footer">
                <button className="btn btn-gold btn-block btn-lg">注册并领取 NEAR</button>
              </div>
            </div>
          </div>
          <div className="near-redenvelope-body">
            <div className="redenvelope-content">
              <div className="redenvelope-content-title">中秋快乐</div>
              <div className="redenvelope-content-subtitle">来自 NEAR 团队的祝福</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Claim;
