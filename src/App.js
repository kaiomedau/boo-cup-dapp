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

  const commonPrice = 0; //6000000000000000000;
  const uncommonPrice = 0; //8000000000000000000;
  const rarePrice = 0; //10000000000000000000;

  //
  //
  //

  const [warningFeedback, setWarningFeedback] = useState(``);
  const [successFeedback, setSuccessFeedback] = useState(``);

  const [mintLive, setMintLive] = useState(false);
  const [whitelisted, setWhitelisted] = useState(false);

  const [minted, setMinted] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);

  const [displayPrice, setDisplayPrice] = useState(`0 MATIC`);
  const [mintPrice, setMintPrice] = useState(0);

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

  // Mint
  const minting = (msg) => {
    setClaimingNft(true);
    loadingToast.loading(msg, { id: loadingToast });
  };
  const endMinting = (ids) => {
    console.log(ids.events.TransferBatch.returnValues.ids);
    // receives the NFT IDS
    setPackIDS(ids.events.TransferBatch.returnValues.ids);
    loadingToast.dismiss();
    toast.success("👻 Boo Yeah!");
    setClaimingNft(false);
  };
  const endMintWithError = (e) => {
    loadingToast.dismiss();
    toast.error(e.message);
    setClaimingNft(false);
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

  const getData = () => {
    if (
      blockchain.account !== "" &&
      blockchain.account !== undefined &&
      blockchain.smartContract !== null
    ) {
      dispatch(fetchData(blockchain.account));
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
      <div id="dapp" class="connect">
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
    </>
  );

  // if (currentTokenID == 0) {
  //   return (
  //     <>
  //       <div id="dapp" class="closed">
  //         <h2 class="mint-title">Boo PFP</h2>

  //         <img class="current-nft" src={"current-pfp.png"}></img>

  //         <div class="price-status">
  //           <h4 class="congratulations">{CONFIG.CURRENT_NFT_NAME}</h4>
  //         </div>

  //         <button disabled>Mint Closed</button>
  //       </div>
  //     </>
  //   );
  // }

  // if (claimingNft) {
  //   return (
  //     <>
  //       <div id="dapp" class="closed">
  //         <h2 class="mint-title">Boo PFP</h2>

  //         <img class="current-nft" src={"current-pfp.png"}></img>

  //         <div class="price-status">
  //           <h4 class="congratulations">Hunting your Boo</h4>
  //           <div class="spinner-container">
  //             <div class="spinner"></div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  // if (minted || parseInt(tokenBalance)) {
  //   return (
  //     <>
  //       <div id="dapp" class="closed">
  //         <h2 class="mint-title">Boo PFP</h2>

  //         <img class="current-nft" src={"current-pfp.png"}></img>

  //         <div class="price-status">
  //           <h4 class="congratulations">Congratulations</h4>
  //           <p>You have minted your {CONFIG.CURRENT_NFT_NAME} PFP!</p>
  //         </div>

  //         <a
  //           href={
  //             "https://opensea.io/assets/matic/0xbf4c805aee2d811d6b9a1b0efe7ca527f231ed41/" +
  //             CONFIG.CURRENT_ID
  //           }
  //           target="_blank"
  //         >
  //           <p>Check it on OpenSea</p>
  //         </a>
  //       </div>
  //     </>
  //   );
  // }

  // if (currentTokenID > 0) {
  //   return (
  //     <>
  //       <div id="dapp" class="closed">
  //         <h2 class="mint-title">Boo PFP</h2>

  //         <img class="current-nft" src={"current-pfp.png"}></img>

  //         {whitelisted != false ? (
  //           <div class="price-status">
  //             <h4 class="congratulations">{displayPrice}</h4>
  //             <p>Is the price of this NFT</p>
  //           </div>
  //         ) : (
  //           <div class="price-status">
  //             <h4 class="congratulations">{CONFIG.CURRENT_NFT_NAME}</h4>
  //           </div>
  //         )}

  //         {whitelisted == false ? (
  //           <p class="not-whitelisted">
  //             This wallet is <strong>not</strong> whitelisted
  //             <br />
  //             for the current PFP
  //           </p>
  //         ) : (
  //           <>
  //             <div class="donation">
  //               {donating == true ? (
  //                 <input
  //                   id="donation-value"
  //                   placeholder="Enter Matic Ammount"
  //                   type="number"
  //                   min="0"
  //                   onChange={(e) => handleDonation(e.target.value)}
  //                 />
  //               ) : (
  //                 <button
  //                   onClick={(e) => {
  //                     setDonating(true);
  //                   }}
  //                 >
  //                   I want to donate to help the project
  //                 </button>
  //               )}
  //             </div>

  //             <button
  //               disabled={claimingNft ? 1 : 0}
  //               onClick={(e) => {
  //                 e.preventDefault();
  //                 claimNFTs();
  //               }}
  //             >
  //               {claimingNft ? "Hunting..." : "Mint your Boo PFP"}
  //             </button>
  //           </>
  //         )}
  //       </div>

  //       {blockchain.errorMsg !== "" ? (
  //         <>
  //           <div class="warning-message">{blockchain.errorMsg}</div>
  //         </>
  //       ) : null}
  //       {warningFeedback !== "" ? (
  //         <>
  //           <div class="warning-message">{warningFeedback}</div>
  //         </>
  //       ) : null}
  //       {successFeedback !== "" ? (
  //         <>
  //           <div class="success-message">{successFeedback}</div>
  //         </>
  //       ) : null}
  //     </>
  //   );
  // }
}

export default App;
