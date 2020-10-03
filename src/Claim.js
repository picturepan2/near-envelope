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
      status: 0,
      secretkey: null,
      walletClaimUrl: '',
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
        let amount = 0,
            walletClaimUrl = ''
        walletClaimUrl = await this.getWalletLink(secretkey)
        amount = await this.checkNearDropBalance(contractName, secretkey)
        this.setState({ secretkey, walletClaimUrl, amount })
        console.log(contractName, secretkey, walletClaimUrl, amount)
        
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

  async getWalletLink(secretkey) {
    return `${window.nearConfig.walletUrl}/create/${window.nearConfig.contractName}/${secretkey}`
  }

  getAccount(accountId) {
    return new nearApi.Account(window.near.connection, accountId)
  }

  render() {
    const { status, walletClaimUrl, amount } = this.state;
    
    return (
      <div className="near-container">
        <div className="near-dapp near-dapp-redenvelope">
          <div className="near-redenvelope-header">
            <img className="redenvelope-cover" src={nearcover} alt="红包封面图" />
            <button className="redenvelope-btn">拆封</button>
          </div>
          <div className="near-redenvelope-body">
            <div className="redenvelope-content">
              <div className="redenvelope-content-title">中秋快乐</div>
              <div className="redenvelope-content-subtitle">来自 NEAR 团队的祝福</div>
            </div>
            <div className="redenvelope-card">
              <img className="redenvelope-cover" src={nearcover} alt="红包封面图" />
              <div className="redenvelope-card-header">
                <div className="h2">中秋快乐</div></div>
              <div className="redenvelope-card-body">
                <div className="">金额</div>
                <div className="h1">{nearTo(amount, 2)}<small>Ⓝ</small></div>
              </div>
              <div className="redenvelope-card-footer">
                <a className="btn btn-gold btn-block btn-lg" href={walletClaimUrl} target="_blank">注册并领取 NEAR</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Claim;
