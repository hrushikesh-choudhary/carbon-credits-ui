import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import CakeIcon from '@mui/icons-material/Cake';
import Typography from '@mui/material/Typography';
import { CallReceived, Paid, PaidOutlined, QuestionMark } from '@mui/icons-material';
import web3 from '../web3';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

const Dashboard = ({account, accountType, contract, url}) => {

    const [timeline, setTimeline] = React.useState([]);
    let ethGained = 0;
    let ethLost = 0;
    let carbonCreditsExchanged = 0;

    React.useEffect(() => {
        fetch(`${url}/get_transactions?address=${account}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => setTimeline(data))
        .catch(error => console.error(error))
    }, [])

    return (
        <>
        <Timeline position="alternate">
            <TimelineItem>
                <TimelineSeparator>
                <TimelineDot color="secondary" >
                    <CakeIcon />
                </TimelineDot>
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        Joined Carbon Credits Dapp!
                    </Typography>
                </TimelineContent>
                </TimelineItem>
        {timeline.length ? timeline.map(t => {
            const dateTime = new Date(t.created_at).toLocaleString()
            if (t.receiver == '0') {
                ethLost += t.amount;
                return (
                    <TimelineItem>
                        <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align="right"
                        variant="body2"
                        color="text.secondary"
                        >
                        {dateTime}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot>
                            <QuestionMark />
                        </TimelineDot>
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                            Requested {t.credits} carbon credits at {-t.amount} ETH
                        </Typography>
                        <Typography>Because you need CO2 and it costed you <span style={{color: 'red'}}>{-t.amount} ETH</span> </Typography>
                        </TimelineContent>
                    </TimelineItem>
                )
            } else if (web3.utils.toChecksumAddress(t.receiver) == web3.utils.toChecksumAddress(account)) {
                carbonCreditsExchanged += t.credits;
                return (
                    <TimelineItem>
                        <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        variant="body2"
                        color="text.secondary"
                        >
                        {dateTime}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="primary">
                            <CallReceived />
                        </TimelineDot>
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                            Received {t.credits} carbon credits for {t.amount}
                        </Typography>
                        <Typography>Because you are awesome!</Typography>
                        </TimelineContent>
                    </TimelineItem>
                )
            }
            ethGained += t.amount;
            carbonCreditsExchanged += t.credits;
            return (
                <TimelineItem>
                    <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    variant="body2"
                    color="text.secondary"
                    >
                    {dateTime}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot color="success">
                        <PaidOutlined color="white" />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                        Sent {t.credits} carbon credits for {t.amount}
                    </Typography>
                    <Typography>You got <span style={{color: 'green'}}>{t.amount} ETH</span> for the credits because you are awesome!</Typography>
                    </TimelineContent>
                </TimelineItem>
            )
        }) : <></>
        }
        </Timeline>
        <CardGroup style={{textAlign: 'center'}}>
            <Card style={{color: 'green'}}>
                
                <Card.Body>
                <Card.Title>ETH Gained</Card.Title>
                <Card.Text style={{fontSize: '14pt'}}>
                    {ethGained}
                </Card.Text>
                </Card.Body>
            </Card>
            <Card style={{color: 'black'}}>
                
                <Card.Body>
                <Card.Title>Carbon Credits Exchanged</Card.Title>
                <Card.Text style={{fontSize: '14pt'}}>
                    {carbonCreditsExchanged}
                </Card.Text>
                </Card.Body>
            </Card>
            <Card style={{color: 'red'}}>
                
                <Card.Body>
                <Card.Title>ETH lost</Card.Title>
                <Card.Text style={{fontSize: '14pt'}}>
                    {ethLost}
                </Card.Text>
                </Card.Body>
            </Card>
        </CardGroup>
        </>
    )
}

export default Dashboard;