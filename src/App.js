import "bootstrap/dist/css/bootstrap.min.css";
import web3 from './web3';
import CarbonCredit from './CarbonCredit';
import { useEffect, useState } from 'react';
import CompanyRegistration from './Components/CompanyRegistration.component';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarTop from './Components/Navbar.component';
import Details from "./Components/Details.component";
import SurveyerRequests from "./Components/SurveyerRequests.component";
import RequestCredits from "./Components/RequestCredits.component";
import ShowPendingRequests from "./Components/ShowPendingRequests.component";
import PublicCreditRequests from "./Components/PublicCreditRequests.component";
import { Toast, ToastContainer } from "react-bootstrap";
import Co2Icon from '@mui/icons-material/Co2';
import Dashboard from "./Components/Dashboard.component";

function App() {

  const [connected, setConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [accountType, setAccountType] = useState(-1);
  const [toasts, setToasts] = useState([])
  const url = "https://damp-beach-24679.herokuapp.com";

  const clearAccount = () => {
    console.log("Here we are!")
    setConnected(false)
  }

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        handleInit(accounts);
      } else setConnected(false);
    });
    window.ethereum.on('accountsChanged', clearAccount);
  }, []);

  const handleInit = async (accounts) => {
    const account = accounts[0];
    setAccount(account);
    setConnected(true);
    setContract(CarbonCredit);
    const result = await CarbonCredit.methods.checkType(account).call();
    console.log(result)
    setAccountType(result);

    CarbonCredit.events.ReceivedSomeCredits({}, async (error, event) => {
      if (error) {
          console.error(error);
          return;
      }
      if(web3.utils.toChecksumAddress(event.returnValues.company) == web3.utils.toChecksumAddress(account))
        setToasts([...toasts, `Received ${event.returnValues.creditCount} carbon credits from ${event?.returnValues?.from}`])
    });
  };

  const connectCallback = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = web3.utils.toChecksumAddress(accounts[0]);
    setAccount(account);
    setConnected(true);
    const result = await CarbonCredit.methods.checkType(account).call();
    // console.log(result)
    console.log("🚀 ~ file: App.js:80 ~ connectCallback ~ Account Type:", result)
    setAccountType(result);
  };


  useEffect(() => {
    const fetchSurveyers = async () => {
      const manager = await CarbonCredit.methods.getSurveyerNames().call();
      console.log("🚀 ~ file: App.js:12 ~ fetchSurveyers ~ Surveyers:", manager)
    }
    fetchSurveyers();
  }, [])

  return (
    <>
    <Router>
      <NavbarTop
        connect={connectCallback}
        connected={connected}
        accountType={accountType}
      />
      <div className="container" style={{marginTop: '2em'}}>
        <Routes>
          <Route path="/" element={ 
            connected && account && (
              accountType == 0 ? <CompanyRegistration account={account} accountType={accountType} contract={contract} />
              :
              accountType == 1 ? <h3>Hello Verified business! Welcome to Carbon Credits!</h3> : 
              <SurveyerRequests account={account} accountType={accountType} contract={contract} />
            ) 
            }
          />
          <Route path="details" element={connected && account && <Details account={account} accountType={accountType} contract={contract} />} />
          <Route
            path="request-credits"
            element={
              connected && account && <RequestCredits account={account} accountType={accountType} contract={contract} url={url} />
            }
          />
          <Route path="requests" element={connected && account && <ShowPendingRequests account={account} accountType={accountType} contract={contract} />} />
          <Route path="open-requests" element={connected && account && <PublicCreditRequests account={account} accountType={accountType} contract={contract} url={url} />} />
          <Route path="timeline" element={connected && account && <Dashboard account={account} accountType={accountType} contract={contract} url={url} />} />
        </Routes>
      </div>
    </Router>
    {/* <div
      aria-live="polite"
      aria-atomic="true"
      className="bg-dark position-relative"
      style={{ minHeight: '240px' }}
    > */}
      <ToastContainer position="bottom-end" className="p-3">
      {
        toasts.map( toast =>
          <Toast autohide={true}>
            <Toast.Header>
              <Co2Icon color="success" />
              <strong className="me-auto" style={{marginLeft: '0.3rem'}}>Carbon Credits</strong>
            </Toast.Header>
            <Toast.Body>{toast || `Received 1 Carbon Credit`}</Toast.Body>
          </Toast>
        )
      }
      </ToastContainer>
      
    {/* </div> */}
    </>
  );
}

export default App;
