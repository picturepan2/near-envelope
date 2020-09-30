import React from 'react';
import iconUser from './assets/img/icon-account.svg';

const User = (props) => {
    const {
        currentUser: { account_id }
    } = props

    // in case account_id is null or undefined
    let accountId = account_id
    if (!accountId || accountId.length === 0) {
        accountId = window.prompt('Your AccountId?')
    }

    return (
        <div className="near-user">
            <div className="dropdown">
            <a className="btn" href="#">
                <img className="btn-icon" src={iconUser} alt="NEAR user" height="40" />
                <span className="text-ellipsis">{accountId}</span>
            </a>
            </div>
        </div>
    )
}

export default User;
