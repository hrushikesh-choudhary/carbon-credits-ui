import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import VerifiedIcon from '@mui/icons-material/Verified';
import DangerousIcon from '@mui/icons-material/Dangerous';
import web3 from '../web3';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { Tooltip } from '@mui/material';

const Details = ({account, accountType, contract}) => {

    const [companyDetails, setCompanyDetails] = useState(null);
    const [surveyerCompanyDetails, setSurveyerCompanyDetails] = useState(null)
    const [verificationStatus, setVerificationStatus] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            const company = await contract.methods.companies(account).call();
            setCompanyDetails(company);
            setVerificationStatus(company.isVerified);
            const surveyCompany = await contract.methods.surveyerCompanies(company.surveyCompany).call();
            console.log(surveyCompany)
            setSurveyerCompanyDetails(surveyCompany);
            if(company.isVerified) {
                const tokens = await contract.methods.getTokens(account).call();
                setTokens(tokens);
            }
            if(!company.isVerified) {
                contract.events.Decision({}, async (error, event) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    console.log(event.returnValues);
                    if(web3.utils.toChecksumAddress(event.returnValues.company) == web3.utils.toChecksumAddress(account)) {
                        console.log("What about In here?")
                        if(!event.returnValues.verification) {
                            setRejected(true);
                            console.log("In here?")
                        } else {
                            setRejected(false);
                            const tokens = await contract.methods.getTokens(account).call();
                            setTokens(tokens);
                        }
                        setVerificationStatus(event.returnValues.verification)
                    }
                    
                });
            }
        }
        fetchCompanyDetails();
    }, [])

    return (
        <center>
            <Card sx={{ maxWidth: 545 }}>
            <CardMedia
                sx={{ height: 340 }}
                image="https://images.unsplash.com/photo-1556983852-43bf21186b2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80"
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div>{companyDetails?.name}</div> 
                        {/* {verificationStatus && !rejcted <VerifiedIcon color="success" style={{marginLeft: '0.3rem'}} />}
                        {rejected && <DangerousIcon color="danger" style={{marginLeft: '0.3rem'}} /> /> } */}
                        {
                            rejected ? <DangerousIcon color="error" style={{marginLeft: '0.3rem'}} />
                            : verificationStatus && <VerifiedIcon color="success" style={{marginLeft: '0.3rem'}} />
                        }
                </Typography>
                {   
                    rejected ? 
                    <Typography sx={{ mb: 1.5 }} color="text.secondary" style={{color: '#d32f2f'}}>
                        Rejected by <u>{surveyerCompanyDetails}</u> <i>(Ref: {companyDetails?.surveyReference})</i>
                    </Typography>
                    :
                    !verificationStatus &&
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Awaiting approval from <u>{surveyerCompanyDetails}</u> <i>(Ref: {companyDetails?.surveyReference})</i>
                    </Typography>
                }
                <Typography variant="body2">
                    <p>Total carbon emission allowance issued: {companyDetails?.totalCredits} ton(s)</p>
                    <p>Total carbon emission used: {companyDetails?.creditsUsed} ton(s)</p>
                    <p>Total carbon credits offsetted: {(companyDetails?.totalCredits - companyDetails?.creditsUsed) - tokens.length}</p>
                    <p>Issued Carbon Credit(s): {tokens.length == 0 && '0'}</p>
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        {
                            verificationStatus && tokens.map(tokenId => {
                                return (
                                <Tooltip title="Token ID">
                                    <Fab className="blob green" variant="extended" style={{background: '#198754', color: 'white'}}>
                                        {tokenId}
                                    </Fab>
                                </Tooltip>
                            )
                        })}
                    </Box>
                </Typography>
            </CardContent>
            </Card>
        </center>
    );

}

export default Details;