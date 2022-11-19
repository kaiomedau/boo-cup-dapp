import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import toast from "react-hot-toast";
import { CONFIG } from "./config/config";
import MintCard from "./components/mintCard";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

// function getMintData(price) {
//   return {
//     gasLimit: String(CONFIG.GAS_LIMIT),
//     maxPriorityFeePerGas: null,
//     maxFeePerGas: null,
//     to: CONFIG.CONTRACT,
//     from: blockchain.account,
//     value: String(price),
//   };
// }

function App() {
  const loadingToast = toast;

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [claimingNft, setClaimingNft] = useState(false);
  const [packIDS, setPackIDS] = useState([]);

  const [whitelisted, setWhitelisted] = useState(0);
  const [viblisted, setviblisted] = useState(0);

  const commonPrice = 0; //6000000000000000000;
  const uncommonPrice = 0; //8000000000000000000;
  const rarePrice = 0; //10000000000000000000;

  //
  //
  //
  const getMintHeader = (price) => {
    return {
      gasLimit: String(CONFIG.GAS_LIMIT),
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
      to: CONFIG.CONTRACT,
      from: blockchain.account,
      value: String(price),
    };
  };

  // const getTokenPrice = () => {
  //   blockchain.smartContract.methods
  //     .tokenPrice()
  //     .call()
  //     .then((receipt) => {
  //       setDisplayPrice(
  //         receipt == 0
  //           ? "Free + Gas"
  //           : Web3B.utils.fromWei(receipt, "ether") + " MATIC + Gas"
  //       );
  //       setMintPrice(receipt);
  //     });
  // };

  // const checkWhitelistForAddress = () => {
  //   console.log(
  //     "🔥 Retriving Whitelist Status for ID: " + String(CONFIG.CURRENT_ID)
  //   );

  //   blockchain.smartContract.methods
  //     .isAddressWhitelistedForTokenId(blockchain.account, CONFIG.CURRENT_ID)
  //     .call()
  //     .then((receipt) => {
  //       console.log("🔥🔥 Whitelist for token: " + receipt);

  //       // Set mint price
  //       setWhitelisted(receipt);
  //     });
  // };

  // ******************************************************
  // Mint
  // ******************************************************
  const minting = (msg) => {
    setClaimingNft(true);
    loadingToast.loading(msg, { id: loadingToast });
  };
  const endMinting = (ids) => {
    console.log(ids.events.TransferBatch.returnValues.ids);
    setPackIDS(ids.events.TransferBatch.returnValues.ids);

    loadingToast.dismiss();
    toast.success("👻 Boo Yeah!");

    setClaimingNft(false);

    getData();
  };
  const endMintWithError = (e) => {
    loadingToast.dismiss();
    toast.error(e.message);
    setClaimingNft(false);

    getData();
  };

  const getCommonPack = () => {
    minting("Minting Common Pack");

    blockchain.smartContract.methods
      .mintCommomPack()
      .send(getMintHeader(commonPrice))
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };

  const getUncommonPack = () => {
    minting("Minting Uncommon Pack");

    blockchain.smartContract.methods
      .mintUncommonPack()
      .send(getMintHeader(uncommonPrice))
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };

  const getRarePack = () => {
    minting("Minting Rare Pack");

    blockchain.smartContract.methods
      .mintRarePack()
      .send(getMintHeader(rarePrice))
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };

  // ******************************************************
  // Whitelist
  // ******************************************************
  const retriveWhitelistCount = () => {
    blockchain.smartContract.methods
      .whitelistCount(blockchain.account)
      .call()
      .then((receipt) => {
        setviblisted(parseInt(receipt[0]));
        setWhitelisted(parseInt(receipt[1]));
        console.log("🔥 Whitelist: " + receipt[0], receipt[1]);
      });
  };
  const getWhitelistCommon = () => {
    minting("Minting Common Whitelist");

    blockchain.smartContract.methods
      .mintWl()
      .send(getMintHeader(commonPrice / 2))
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };
  const getVIPCommonPacks = () => {
    minting("Minting VIB Common Packs");

    blockchain.smartContract.methods
      .mintVIBCommon()
      .send(getMintHeader(0))
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };
  const getVIPUncommonPack = () => {
    minting("Minting VIB Uncommon Pack");

    blockchain.smartContract.methods
      .mintVIBUncommon()
      .send(getMintHeader(0))
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };

  // ******************************************************
  // DAPP
  // ******************************************************
  const getData = () => {
    if (
      blockchain.account !== "" &&
      blockchain.account !== undefined &&
      blockchain.smartContract !== null
    ) {
      retriveWhitelistCount();
      // dispatch(fetchData(blockchain.account));
      // get whitelist total
      // checkWhitelistForAddress();
      // get token price
      // getTokenPrice();
      // get mint count
      // getTokenBalanceForAddress();
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  // ******************************************************
  // Connect Wallet
  // ******************************************************
  const connectWallet = () => {
    dispatch(connect());
    getData();
  };

  const dismissResult = () => {
    setPackIDS([]);
  };

  return (
    <div id="dapp">
      {packIDS.length ? (
        <div id="mint-result">
          <div className="wrapper">
            <h4>🎉 These are your NFTs 🎉</h4>
            <div id="cards">
              {packIDS.map((i, index) => (
                <div className="card" key={index}>
                  <img src={"/images/nfts/" + i + ".png"} />
                </div>
              ))}
            </div>
            <button onClick={dismissResult}>Dismiss</button>
          </div>
        </div>
      ) : null}

      {whitelisted || viblisted ? (
        <div id="whitelists">
          <h2>VIP Packs</h2>
          <div className="card-packs">
            {whitelisted ? (
              <MintCard
                type="wlcommon"
                label="Get this Pack"
                price="03 Matic"
                onClick={getWhitelistCommon}
                account={blockchain.account}
                minting={claimingNft}
                onConnect={connectWallet}
              />
            ) : null}
            {viblisted ? (
              <>
                <MintCard
                  type="vibcommon"
                  label="Get this Packs"
                  price="Free"
                  onClick={getVIPCommonPacks}
                  account={blockchain.account}
                  minting={claimingNft}
                  onConnect={connectWallet}
                />
                <MintCard
                  type="vibuncommon"
                  label="Get this Pack"
                  price="Free"
                  onClick={getVIPUncommonPack}
                  account={blockchain.account}
                  minting={claimingNft}
                  onConnect={connectWallet}
                />
              </>
            ) : null}
          </div>
        </div>
      ) : null}
      <div>
        <h2>Packs</h2>
        <div className="card-packs">
          <MintCard
            type="common"
            label="Get this Pack"
            price="06 Matic"
            onClick={getCommonPack}
            account={blockchain.account}
            minting={claimingNft}
            onConnect={connectWallet}
          />
          <MintCard
            type="uncommon"
            label="Get this Pack"
            price="08 Matic"
            onClick={getUncommonPack}
            account={blockchain.account}
            minting={claimingNft}
            onConnect={connectWallet}
          />
          <MintCard
            type="rare"
            label="Get this Pack"
            price="10 Matic"
            onClick={getRarePack}
            account={blockchain.account}
            minting={claimingNft}
            onConnect={connectWallet}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {packIDS.map((i, index) => (
        <div key={index}>
          <img width="100" src={"/images/nfts/" + i + ".png"} />
        </div>
      ))}

      <ul>
        <li>
          {claimingNft === true ? (
            <button disabled>Common Pack</button>
          ) : (
            <button
              onClick={(e) => {
                getCommonPack();
              }}
            >
              Common Pack
            </button>
          )}
        </li>
        <li>
          <button
            onClick={(e) => {
              getUncommonPack();
            }}
          >
            Uncommon Pack
          </button>
        </li>
        <li>
          <button
            onClick={(e) => {
              getRarePack();
            }}
          >
            Rare Pack
          </button>
        </li>
      </ul>
      <ul>
        {whitelisted ? (
          <li>
            {claimingNft === true ? (
              <button disabled>Common WL</button>
            ) : (
              <button
                onClick={(e) => {
                  getWhitelistCommon();
                }}
              >
                Common WL
              </button>
            )}
          </li>
        ) : null}

        {viblisted ? (
          <>
            <li>
              <button
                onClick={(e) => {
                  getVIPCommonPacks();
                }}
              >
                Common VIB
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  getVIPUncommonPack();
                }}
              >
                Uncommon VIB
              </button>
            </li>
          </>
        ) : null}
      </ul>
    </>
  );
}

export default App;
