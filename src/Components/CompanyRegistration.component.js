import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';

const CompanyRegistration = ({account, accountType, contract}) => {

    const [surveyers, setSurveyers] = useState([]);
    const [surveyersAddress, setSurveyersAddress] = useState([])
    const [show, setShow] = useState(false);

    useEffect(() => {
        const fetchSurveyers = async () => {
            console.log("HERE!")
            const companies = await contract.methods.getSurveyerNames().call();
            setSurveyers(companies);
            const companiesAddress = await contract.methods.getSurveyerAddress().call();
            setSurveyersAddress(companiesAddress);
            console.log(companiesAddress)
            console.log("Done")
        }
        fetchSurveyers();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const name = event.target[0].value;
        const surveyer = surveyersAddress[surveyers.indexOf(event.target[1].value)];
        const ref = event.target[2].value;
        const totalCredits = event.target[3].value;
        const creditsUsed = event.target[4].value;
        // const result = await contract.methods.registerCompany(account, name, totalCredits, creditsUsed, ref, surveyer).send({from : account});
        contract.methods.registerCompany(account, name, totalCredits, creditsUsed, ref, surveyer).send({from : account})
            .then(() => {
                setShow(true)
            })
    }

    return (
        <>
            <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
                <Alert.Heading style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Woohoo! <CelebrationRoundedIcon /></Alert.Heading>
                <p style={{textAlign: 'center'}}>
                    Company Successfully Registered!
                    Awaiting approval from your Surveyer company.
                </p>
                {/* <center><hr style={{width: '70%'}} /></center> */}
                <div className="d-flex justify-content-end">
                {/* <Button onClick={() => setShow(false)} variant="outline-success">
                    Thanks! <DoneAllRoundedIcon />
                </Button> */}
                </div>
            </Alert>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control placeholder="Enter company name" required/>
                </Form.Group>
        
                <Form.Group className="mb-3" controlId="formBasicSurveyer">
                    <Form.Label>Surveyer</Form.Label>
                    <Form.Select aria-label="Default select example" required>
                        <option>Click to open</option>
                        {
                            surveyers?.map((surveyer) => {
                                return <option value={`${surveyer}`} key={`${surveyer}`}>{surveyer}</option>
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSurveyerRef">
                    <Form.Label>Surveyer Reference</Form.Label>
                    <Form.Control placeholder="Enter survey reference number" required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicTotalCredits">
                    <Form.Label>Total Credits Assigned</Form.Label>
                    <Form.Control type="number" placeholder="Enter total credits assigned" required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCreditsUsed">
                    <Form.Label>Total Credits Used</Form.Label>
                    <Form.Control type="number" placeholder="Enter total credits used" required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    );
}

export default CompanyRegistration;