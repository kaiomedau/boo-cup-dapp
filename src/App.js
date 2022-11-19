import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import toast from "react-hot-toast";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

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
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
  });

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

    let totalCostWei = String(commonPrice); // must be WEI cost
    blockchain.smartContract.methods
      .mintCommomPack()
      .send({
        gasLimit: String(CONFIG.GAS_LIMIT),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };
  const getUncommonPack = () => {
    minting("Minting Uncommon Pack");

    let totalCostWei = String(uncommonPrice); // must be WEI cost
    blockchain.smartContract.methods
      .mintUncommonPack()
      .send({
        gasLimit: String(CONFIG.GAS_LIMIT),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };
  const getRarePack = () => {
    minting("Minting Rare Pack");

    let totalCostWei = String(rarePrice); // must be WEI cost
    blockchain.smartContract.methods
      .mintRarePack()
      .send({
        gasLimit: String(CONFIG.GAS_LIMIT),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
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

    let totalCostWei = String(commonPrice / 2); // must be WEI cost
    blockchain.smartContract.methods
      .mintWl()
      .send({
        gasLimit: String(CONFIG.GAS_LIMIT),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };
  const getVIPCommonPacks = () => {
    minting("Minting VIB Common Packs");

    let totalCostWei = String(0); // must be WEI cost
    blockchain.smartContract.methods
      .mintVIBCommon()
      .send({
        gasLimit: String(CONFIG.GAS_LIMIT),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };
  const getVIPUncommonPack = () => {
    minting("Minting VIB Uncommon Pack");

    let totalCostWei = String(0); // must be WEI cost
    blockchain.smartContract.methods
      .mintVIBUncommon()
      .send({
        gasLimit: String(CONFIG.GAS_LIMIT),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        endMintWithError(err);
      })
      .then((receipt) => {
        endMinting(receipt);
      });
  };

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

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const config = await configResponse.json();

    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  // Check if wallet is connected
  if (
    !blockchain.account ||
    blockchain.account === undefined ||
    blockchain.account === "" ||
    blockchain.smartContract === null
  ) {
    return (
      <div id="dapp" className="connect">
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
            getData();
          }}
        >
          Connect your wallet
        </button>
      </div>
    );
  }

  return (
    <>
      {packIDS.map((i) => (
        <div key={i}>
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
