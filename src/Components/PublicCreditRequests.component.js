import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red, pink, deepPurple, blue, cyan, teal, deepOrange, blueGrey } from '@mui/material/colors';
import { Badge, Button, Chip, Tooltip } from '@mui/material';
import web3 from '../web3';


const PublicCreditRequests = ({account, accountType, contract, url}) => {

    const [requests, setRequests] = useState([])
    const [remainingTokens, setRemainingTokens] = useState(0);

    const colors = [
        red, pink, deepPurple, blue, cyan, teal, deepOrange, blueGrey
    ]

    useEffect(() => {
        const fetchSurveyerRequests = async () => {
            let companies = await contract.methods.getCompanyAddresses().call()
            companies = companies.filter(str => web3.utils.toChecksumAddress(str) != web3.utils.toChecksumAddress(account));
            const tokens = await contract.methods.getTokens(account).call();
            setRemainingTokens(tokens.length);
            let requestArray = []
            for(let i = 0; i < companies.length; i++) {
                const creditRequests = await contract.methods.getCreditRequests(companies[i]).call()
                const companyDetails = await contract.methods.companies(companies[i]).call();
                const costs = await contract.methods.getCostPerCredit(companies[i]).call();
                const companyTokens = await contract.methods.getTokens(companies[i]).call();
                const obj = {
                    requestedTokens: creditRequests,
                    name: companyDetails.name,
                    totalCredits: companyDetails.totalCredits,
                    creditsUsed: companyDetails.creditsUsed,
                    requester: companies[i],
                    companyTokens: companyTokens.length,
                    perCreditCost: costs
                } 
                requestArray.push(obj);
            }
            console.log(requestArray)
            setRequests(requestArray);
        }
        fetchSurveyerRequests();
    }, [])

    const transferTokens = async (to, numberOfTokens, cost, index) => {
        console.log("🚀 ~ file: PublicCreditRequests.component.js:51 ~ transferTokens ~ index:", index)
        console.log("🚀 ~ file: PublicCreditRequests.component.js:51 ~ transferTokens ~ cost:", cost)
        console.log("🚀 ~ file: PublicCreditRequests.component.js:51 ~ transferTokens ~ numberOfTokens:", numberOfTokens)
        console.log("🚀 ~ file: PublicCreditRequests.component.js:51 ~ transferTokens ~ to:", to)
        
        if(numberOfTokens > remainingTokens) {
            alert('You do not have enough tokens to make the transfer');
            return;
        }
        const result = await contract.methods.transferCredits(to, account, numberOfTokens, cost, index).send({from: account});
        fetch(`${url}/register_log?address=${account}&request_type=1&sender=${account}&credits=${numberOfTokens}&amount=${cost / 10000}&receiver=${to}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
            window.location.reload();
        })
    }

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6" gutterBottom>
                    Credits Requested publicly by other companies
                </Typography>
                <div>
                    <Typography variant="overline" display="block" gutterBottom>
                        <u><i>Your remaining carbon credits: {remainingTokens}</i></u>
                    </Typography>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
            {
                requests?.map(request => {
                    const randomIndex = Math.floor(Math.random() * colors.length);
                    const randomColor = colors[randomIndex];
                    return request.requestedTokens.map((requestedToken, idx) => {
                        return (
                            <div style={{marginTop: '2rem'}}>
                            <Badge badgeContent={`+${requestedToken * (request.perCreditCost[idx] / 10000)} ETH`} color="success">
                            <Card sx={{ maxWidth: 345 }}>
                                <CardHeader
                                    avatar={
                                    <Avatar sx={{ bgcolor: randomColor[500] }} aria-label="title">
                                        {request?.name[0]}
                                    </Avatar>
                                    }
                                    title={request?.name}
                                    // TODO: Remove this from everywhere
                                    // subheader="September 14, 2016"
                                    action={
                                        <>
                                            <Tooltip title="Transfer credits">
                                                <Chip label="Transfer" color="success" variant="outlined" onClick={() => transferTokens(request?.requester, requestedToken, requestedToken * (request.perCreditCost[idx]), idx)} />
                                            </Tooltip>
                                        </>
                                    }
                                />
                                <hr />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        <p>Total carbon emission allowance issued: {request?.totalCredits} ton(s)</p>
                                        <p>Total carbon emission used: {request?.creditsUsed} ton(s)</p>
                                        <p>Carbon Credits requested: {requestedToken}</p>
                                        <p>Carbon Credits offsetted: {(request?.totalCredits - request?.creditsUsed) - request?.companyTokens}</p>
                                    </Typography>
                                </CardContent>
                            </Card>
                            </Badge>
                            </div>
                        )
                    })
                })
            }
            
        </div>
        </>
    );
}

export default PublicCreditRequests;