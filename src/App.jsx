import abi from './ABI';
import './App.css';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import imgback from "./left-img.jpg";
import cand from "./cand.png";
import { ethers } from 'ethers'

function App() {

  const [web3, setWeb3] = useState(null);
  const [count, getcount] = useState(1);
  const [newc, setnewc] = useState("");
  const [totalvte, gettotalvte] = useState(0);
  const [alldata, setalldata] = useState([]);
  const [candidates, setcandidtaes] = useState([]);
  const [contract, setcontract] = useState(null);
  const [events, setevents] = useState([]);
  let tot;
  async function initializeWeb3() {
    if (window.ethereum) {

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const tempWeb3 = new Web3(window.ethereum);
        setWeb3(tempWeb3);
        const tempContract = new tempWeb3.eth.Contract(abi, "0xd9145CCE52D386f254917e481eB44e9943F39138");
        setcontract(tempContract);
        console.log(contract);
        gettotalvte(0);
        getDataTFrontEnd(tempContract);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("MetaMask extension not detected");
    }

  }


  useEffect(() => {
    getcount(1);
    initializeWeb3();

  }, []);

  const getDataTFrontEnd = async (contracta) => {
    setcandidtaes([]);
    setalldata([]);
    try {
      const dataa = await contracta.methods.forFrontEnd().call();

      for (let s = 0; s < dataa.length; s++) {
        setcandidtaes((prevProducts) => [...prevProducts, dataa[s].name]);
        setalldata((prevData) => [...prevData, dataa[s]]);
        gettotalvte((count) => count + Number(dataa[s].voteCount));
      }
      console.log(tot)
    } catch (error) {
      console.log(error);
    }

  }

  const callElection = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods.election(newc).send({ from: accounts[0] });
    console.log(result);
    alert("Candidate added successfully!!");
  }



  const vote = async (e) => {
    e.preventDefault();
    console.log("selected party" + newc);
    try {
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods.vote(0).send({ from: accounts[0] });
      console.log(result);
      alert("Vote casted successfully!!");

    } catch (error) {
      alert("Already voted!! cannot vote again!!");
      console.log(error);
    }
  }

  const watchEvents = async () => {
    getcount(5);
    const latestBlock = await web3.eth.getBlockNumber();
    const fromBlock = Number(latestBlock) - 999;

    const eventsa = await contract.getPastEvents("votedEvent", {
      fromBlock: fromBlock,
    });

    console.log(eventsa);
    setevents(eventsa);
  }

  return (
    <div className="App">
      <img src={imgback} alt="" className='background' />
      <div className='btn_page'>
        <button className='top_btn t1' style={{ color: "#F38888" }} onClick={() => getcount(2)}>SET CANDIDATE</button>
        <button className='top_btn t2' style={{ color: "#C9F5B4" }} onClick={() => {
          console.log(alldata)
          getcount(3)
        }}>SHOW CANDIDATE</button>
        <button className='top_btn t3' style={{ color: "#EBEE5C" }} onClick={() => getcount(4)}>VOTE</button>
        <button className='top_btn t4' style={{ color: "#C3C5ED" }} onClick={watchEvents}>WATCH EVENTS</button>
      </div>

      <div className='main_ev'>
        {
          (count === 1) ? <><div className='top'>
            <h1 className='aa'>WEB3 VOTING SYSTEM!!</h1>
            <h1 className='bb'>Cast your vote!!</h1>
          </div>
            <div className='cand_all'>
              {
                candidates.map((e) => {
                  return <div className='cand_ind'>
                    <img className='img-of-cand' src={cand} alt="" />
                    <h1 key={e} className='my_cand cat'>{e}</h1>
                  </div>
                })
              }
            </div>
          </>
            : (count === 2) ? <>
              <div className='set_cand'>
                <form onSubmit={callElection}>
                  <label className='label'>ENTER CANDIDATE NAME</label>
                  <input type="text" className='cand_name' required onChange={(e) => setnewc(e.target.value)} />
                  <input type='submit' className='submit' />
                </form>
              </div>

            </>
              : (count === 3) ? <>
                <div className='cand_all'>
                  {
                    alldata.map((e) => {
                      return <div className='a_mark'><div className='cand_ind da'>
                        <img className='img-of-cand' src={cand} alt="" />
                        <h1 key={e} className='my_cand'>{e.name}</h1>
                        <div className='out_box'>
                          <div style={{ width: `${(((Number(e.voteCount)) / totalvte) * 300) + 1}px` }} className='in_box'></div>
                        </div>
                      </div>
                        <h1 className='my_cand ca'>{e.voteCount.toString()}</h1>
                      </div>
                    })
                  }
                </div>
              </>
                : (count === 4) ? <>
                  <div className='cand_all'>
                    <h1 className='bb'>Cast your vote!!</h1>
                    <form onSubmit={vote}>
                      {
                        candidates.map((e) => {
                          return <div className='cand_ind'>

                            <input type="radio" name="candidate" value={e} key={e} className='my_cand rat' onClick={(e) => setnewc(e.target.value)} />

                            <label className='my_cand cat'>{e}</label>
                            <img className='img-of-cand' src={cand} alt="" />

                          </div>
                        })
                      }
                      <input type="submit" className='submit' />
                    </form>
                  </div>
                </>
                  : <>
                    <p>{events.address}</p>
                  </>
        }

      </div>
    </div>
  );
}

export default App;
