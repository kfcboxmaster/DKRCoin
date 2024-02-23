import { useState, useEffect } from "react";
import myNFT from '../MyNFT.json'
import {ethers, BigNumber} from 'ethers';
import "./mainbody.css"


function Mainbody() {
    
    const [connected, setConnected]=useState(false)
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading]=useState(false)
    const [totalMinted, setTotalMinted] = useState(0);
    const maxMinted=100;
    const displayTokens = `${totalMinted}/${maxMinted}`
    const displayStatus = totalMinted===maxMinted ? 'SOLD OUT': displayTokens
    

    async function connectWallet(){
        if (window.ethereum) {
            try{
              await window.ethereum.request({method:"eth_requestAccounts"}) ;
              setConnected (true);
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              await provider.send('eth_requestAccounts', []);
              const wallet = new ethers.Wallet(process.env.METAMASK, provider);
              const signer = wallet.provider.getSigner(wallet.address);
              const address = await signer.getAddress()
              
            } catch (e) {
                console.log(e);
            }
        } else {
            alert('Установите metamask')
        }
    }


    useEffect(()=> {
        const intervalId = setInterval(async() => {
            const newTotalMinted = await getTotalTokens();
            setTotalMinted(newTotalMinted)
    }, 3000);
    return ()=>clearInterval(intervalId)
    }, [])

    const contractAddress = '0x142155Deb4f363Db40FAA38Dfa6454A833a92F35';
    let provider ;
    if (typeof window.ethereum !== 'undefined'){
        provider=new ethers.providers.Web3Provider(window.ethereum)
    } else {provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/47bd0a928dc14158898d88ad52dc8937')}
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, myNFT.abi, signer)

    const mintFunction = async()=>{
        try {
            setLoading(true);
            const connection = contract.connect(signer);
            const addr=connection.address;
            const response = await contract.mint(BigNumber.from(quantity), {
                value: ethers.utils.parseEther(('0.005'* quantity).toString()),
            });
            console.log("response: ", response);

        } catch (error) {
            const errorMessage=error.message || '';
            if (errorMessage.includes("user rejected transaction")){
                setError("You rejected transaction");
            } else {
                const match = errorMessage.match(/reason="execution reverted: ([^"]*)"/);
                if (match && match [1]){
                    setError (match[1]);
                } else {
                    setError('Something went wrong ...');
                }
            }
        } finally{
            setLoading(false);
        }
    }

    async function getTotalTokens(){
        const totalTokens=await contract.getTotalTokensMinted();
        return totalTokens.toNumber();
    }
    return (
      <div className="mainbody"> 
      
        <h2>NFT Development</h2>
        <div>
            {connected ? <button onClick={mintFunction}>Mint</button> : <button onClick={connectWallet}>Connect</button>}
            </div>
            <div>
            {connected ? 
            <div><h2>Кошелек подключен</h2> 
            <h3>{displayStatus}</h3>
            </div>
            
             : <h2>Подлкючите Metamask</h2>}
            </div>

            <div>
                <h3>{error} </h3>
                <div> {loading ? <h3>{loading}</h3> : ''}</div>
            </div>
      </div>
    );
  }
  
  export default Mainbody;
  