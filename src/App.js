import abi from "./chai.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Buy from "./components/Buy";
import Memos from "./components/Memos";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/NavigationBar';
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Mainbody from "./components/Mainbody";
import React from 'react';


function App() {
  
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x4b5a20Cf1Ee3C7fE40FD3026F12CE6ac2AB81833";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  // console.log(state); <img src={chai} className="img-fluid" alt=".." width="100%" />
  return (
    <div>
      <NavigationBar />
      <Mainbody />
    <div className="container">
      <h1 className="connected-account alert alert-primary" role="alert"><span className="lead text-center">Connected Account</span><br />{account}</h1>
      <Buy state={state} />
      <Memos state={state} />
    </div>
    
  </div>
  );
}

export default App;


