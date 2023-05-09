import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';
import { Typography } from '@mui/material';
import web3 from '../web3';
import { InputGroup } from 'react-bootstrap';

const RequestCredits = ({account, accountType, contract, url}) => {

    const [companyDetails, setCompanyDetails] = useState([]);
    const [show, setShow] = useState(false);
    const [balance, setBalance] = useState(null);
    const [credits, setCredits] = useState(0);
    const [canRequest, setCanRequest] = useState(false);
    const [perCreditCost, setPerCreditCost] = useState(475);

    useEffect(() => {
        const fetchDetails = async () => {
            const company = await contract.methods.companies(account).call();
            setCompanyDetails(company);
            if(company.remainingRequests >= 1 && company.isVerified) {
                setCanRequest(true);
            }

            const balanceInWei = await web3.eth.getBalance(account);
            const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');
            setBalance(balanceInEth);

            const costs = await contract.methods.getCostPerCredit(account).call();
            console.log("🚀 ~ file: RequestCredits.component.js:31 ~ fetchDetails ~ costs:", costs)
            const tokens = await contract.methods.getTokens(account).call();
            const defaultCost = 475 + ((5 - company.remainingRequests - ((company.totalCredits - company.creditsUsed) - tokens.length)) * 17)
            console.log("🚀 ~ file: RequestCredits.component.js:34 ~ fetchDetails ~ defaultCost:", defaultCost)
            // setPerCreditCost((costs[costs.length - 1] / 100) || defaultCost / 100);
            setPerCreditCost(defaultCost / 10000);
        }
        fetchDetails();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const value = web3.utils.toWei((perCreditCost * credits).toString(), 'ether');
        const result = await contract.methods.registerReceiveRequest(account, credits).send({from: account, value: value});
        setShow(true);
        fetch(`${url}/register_log?address=${account}&request_type=1&sender=${account}&credits=${credits}&amount=${-(perCreditCost * credits)}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))
    }

    const handleCreditChange = (e) => {
        setCredits(e.target.value);
    }

    return (
        <>
            {
                canRequest && balance >= (4.75 / 10000) ?
                    <>
                        <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Woohoo! <CelebrationRoundedIcon /></Alert.Heading>
                            <p style={{textAlign: 'center'}}>
                                Credits Successfully Requested!
                                Let's wait for a company to accept your proposal.
                            </p>
                            {/* <center><hr style={{width: '70%'}} /></center> */}
                            <div className="d-flex justify-content-end">
                            {/* <Button onClick={() => setShow(false)} variant="outline-success">
                                Thanks! <DoneAllRoundedIcon />
                            </Button> */}
                            </div>
                        </Alert>
                        <Typography variant="h6" gutterBottom>
                            Requesting credits (publicly)
                        </Typography>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography variant="overline" display="block" gutterBottom>
                                Request Number: {5 - companyDetails.remainingRequests + 1}
                            </Typography>
                            <Typography variant="overline" display="block" gutterBottom>
                                Requests Remaining: {companyDetails.remainingRequests}
                            </Typography>
                        </div>
                        <Form onSubmit={handleSubmit} style={{marginTop: '2rem'}}>
                            <Form.Group className="mb-3" controlId="formBasicTotalCredits">
                                <Form.Label>Number of credits</Form.Label>
                                <Form.Control type="number" placeholder="Enter number of credits to be requested" required min={1} max={3} onChange={handleCreditChange} value={credits} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCreditsUsed">
                                <Form.Label>Amount in ETH you'll be paying for {credits} credit(s) <i>(balance: {balance})</i></Form.Label>
                                <Form.Control type="number" step="any" placeholder="" required min={1} max={balance} value={credits * perCreditCost} disabled />
                                <Form.Text className="text-muted">
                                    We calculate the value based on your Carbon score.
                                </Form.Text>
                            </Form.Group>
                            <center><Button variant="outline-success" type="submit">Request</Button></center>
                        </Form>
                    </>
                    :
                    <h3>Looks like you've either run out of requests, ether or you are not verified yet.</h3>
            }
        </>
    );
}

export default RequestCredits;