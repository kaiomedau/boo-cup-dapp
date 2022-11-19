import React, { Component } from "react";

class MintCard extends Component {
  renderButton() {
    const { account, label, minting, onConnect, onClick } = this.props;

    if (!account || account === undefined || account === "") {
      return <button onClick={onConnect}>Connect Wallet</button>;
    } else if (!minting) {
      return <button onClick={onClick}>{label}</button>;
    } else {
      return <button disabled>Minting Pack...</button>;
    }
  }

  renderCard() {
    const { type, price } = this.props;

    return (
      <>
        <div className="pack">
          <div className={"pack-image " + type}></div>
          <div className="price-tag">{price}</div>
          <div className="mint-button">{this.renderButton()}</div>
        </div>
      </>
    );
  }

  render() {
    return <>{this.renderCard()}</>;
  }
}

export default MintCard;
