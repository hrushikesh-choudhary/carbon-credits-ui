import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, pink, deepPurple, blue, cyan, teal, deepOrange, blueGrey } from '@mui/material/colors';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

const SurveyerRequests = ({account, accountType, contract}) => {

    const [requests, setRequests] = useState([])

    const colors = [
        red, pink, deepPurple, blue, cyan, teal, deepOrange, blueGrey
    ]

    useEffect(() => {
        const fetchSurveyerRequests = async () => {
            const requests = await contract.methods.showRegistrationRequests(account).call();
            console.log("🚀 ~ file: SurveyerRequests.component.js:20 ~ fetchSurveyerRequests ~ requests:", requests)
            let requestDetails = []
            for (let i = 0; i < requests.length; i++) {
                let details = await contract.methods.companies(requests[i]).call();
                details['company'] = requests[i];
                console.log("🚀 ~ file: SurveyerRequests.component.js:24 ~ fetchSurveyerRequests ~ details:", details)
                requestDetails.push(details);
            }
            requestDetails.sort((a, b) => a.isVerified - b.isVerified);
            console.log("Here?")
            setRequests(requestDetails);
            console.log("🚀 ~ file: SurveyerRequests.component.js:27 ~ fetchSurveyerRequests ~ requestDetails:", requestDetails)
        }
        fetchSurveyerRequests();
    }, [])

    const approveRequest = async (company) => {
        const result = await contract.methods.approveCreditInfo(company).send({from: account});
        let newRequests = requests;
        const obj = newRequests.find(item => item.company === company);
        if (obj) {
            obj.isVerified = true;
        }
        console.log(newRequests);
        newRequests.sort((a, b) => a.isVerified - b.isVerified);
        setRequests(newRequests)
        window.location.reload();
    }

    const rejectRequest = async (company) => {
        const result = await contract.methods.rejectCreditInfo(company).send({from: account});
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
            {
                requests.map(request => {
                    const randomIndex = Math.floor(Math.random() * colors.length);
                    const randomColor = colors[randomIndex];
                    return (<Card sx={{ maxWidth: 345, marginTop: '2rem' }}>
                        <CardHeader
                            avatar={
                            <Avatar sx={{ bgcolor: randomColor[500] }} aria-label="title">
                                {request?.name[0]}
                            </Avatar>
                            }
                            title={request?.name}
                            subheader="September 14, 2016"
                            action={
                                <>
                                    {
                                        request.isVerified ? 
                                            <Tooltip title="Approved">
                                                <VerifiedIcon color='success' /> 
                                            </Tooltip>
                                        :
                                        <>
                                            <Tooltip title="Approve Request">
                                                <IconButton aria-label="approve" onClick={() => approveRequest(request.company)}>
                                                    <CheckCircleOutlineRoundedIcon color='success' />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reject Request">
                                                <IconButton aria-label="reject" onClick={() => rejectRequest(request.company)}>
                                                    <HighlightOffIcon color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                </>
                            }
                        />
                        <hr />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                            <p>Reference: {request.surveyReference}</p>
                            <p>Total carbon emission allowance issued: {request?.totalCredits} ton(s)</p>
                            <p>Total carbon emission used: {request?.creditsUsed} ton(s)</p>
                            <p>Carbon Credits to be issued: {request?.totalCredits - request?.creditsUsed}</p>
                            </Typography>
                        </CardContent>
                    </Card>)
                })
            }
            
        </div>
    );
}

export default SurveyerRequests;