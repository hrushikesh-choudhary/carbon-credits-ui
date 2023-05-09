import { useEffect, useState } from 'react';
import { Avatar, Card, CardHeader, Chip, Typography } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import web3 from '../web3';

const ShowPendingRequests = ({account, accountType, contract}) => {

    const [requests, setRequests] = useState([])

    useEffect(() => {
        const fetchDetails = async () => {
            const company = await contract.methods.companies(account).call();
            const requests = await contract.methods.getCreditRequests(account).call();
            setRequests(requests);
        }
        fetchDetails();
    }, [])

    return (
        <center>
            <Typography variant="h6" gutterBottom>
                Your pending requests ({requests.length})
            </Typography>
            {
                requests.map((request, idx) => {
                    return (
                        <Card sx={{ maxWidth: 345, marginTop: '2rem' }}>
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: deepPurple[500] }} aria-label="title">
                                    {idx + 1}
                                </Avatar>
                                }
                                title={`Credits requested: ${request}`}
                                subheader="September 14, 2016"
                                action={
                                    <>
                                        {
                                            <Chip label="Pending" color="primary" variant="outlined"  />
                                        }
                                    </>
                                }
                            />
                        </Card>
                    )
                })
            }
            
        </center>
    );
}

export default ShowPendingRequests;