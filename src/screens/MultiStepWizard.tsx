import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import { Checkbox, FormControlLabel, Snackbar, Typography } from '@mui/material';
import PersonalInfo from '../components/PersonalInfo';
import ContactDetails from '../components/ContactDetails';
import LoanRequest from '../components/LoanRequest';
import FinancialInfo from '../components/FinancialInfo';

const API_URL = 'http://localhost:3001/entities';

const steps = ['Personal Info', 'Address', 'Occupation', 'Financial Info', 'Finalization'];

const MultiStepWizard: React.FC = () => {
    const [activeStep, setActiveStep] = useState(
        () => {
            const savedStep = localStorage.getItem('activeStep');
            return savedStep ? parseInt(savedStep, 10) : 0;
        }
    );
    const [allFormData, setAllFormData] = useState(
        () => {
            const savedData = localStorage.getItem('formData');
            return savedData ? JSON.parse(savedData) : {};
        }
    );
    const [uuid, setUuid] = useState(
        () => {
            const savedUuids = localStorage.getItem('uuid');
            return savedUuids ? JSON.parse(savedUuids) : [];
        }
    );
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
        'success',
    );
    const [confirmation, setConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [restartForm, setRestartForm] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('activeStep', activeStep.toString());
            localStorage.setItem('formData', JSON.stringify(allFormData));
            localStorage.setItem('uuid', JSON.stringify(uuid));
        }
    }, [activeStep, allFormData, uuid, isLoading]);

    const handleNext = async (data: any) => {
        let currentFormData: any = data;

        if (activeStep === 3) {
            const loanAmount = allFormData.loanAmount || 0;
            const terms = allFormData.terms || 0;
            const { monthlySalary, additionalIncome = 0, mortgage = 0, otherCredits = 0 } = currentFormData;

            if ((monthlySalary + additionalIncome - mortgage - otherCredits) * terms * 0.5 < loanAmount) {
                setSnackbarMessage('Validation failed. Please reduce loan amount or restart.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
        }

        try {
            let apiUrl = API_URL;
            if (activeStep > 0) {
                apiUrl = `${API_URL}/${uuid}`;
            }

            const response = activeStep === 0 ? await axios.post(apiUrl, currentFormData) : await axios.patch(apiUrl, currentFormData)

            if (activeStep === 0) {
                setUuid(response.data.entity.uuid);
            }

            setAllFormData({ ...allFormData, ...currentFormData });
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSnackbarMessage('Step data saved successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('API Error:', error);
            setSnackbarMessage('API Error. Check console.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }

    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const localStorageCleanUp = () => {
        setActiveStep(0);
        setAllFormData({});
        setUuid("");
    }

    const handleSubmit = async () => {
        if (!confirmation) {
            setSnackbarMessage("Please confirm that all data is correct");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        console.log('Final Data:', allFormData);
        setSnackbarMessage('Form submitted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setRestartForm(true);
    };

    const handleSnackbarClose = (
        event: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <PersonalInfo handleNext={handleNext} allFormData={allFormData} />
                );
            case 1:
                return (
                    <ContactDetails handleNext={handleNext} allFormData={allFormData} />
                );
            case 2:
                return (
                    <LoanRequest handleNext={handleNext} allFormData={allFormData} />
                );
            case 3:
                return (
                    <FinancialInfo handleNext={handleNext} allFormData={allFormData} />
                );
            case 4:
                return (
                    <>
                        <Typography variant="h6">Review Information</Typography>
                        <pre>{JSON.stringify(allFormData, null, 2)}</pre>
                        <FormControlLabel
                            control={<Checkbox checked={confirmation} onChange={(e) => setConfirmation(e.target.checked)} />}
                            label="I confirm all data is correct"
                        />
                        {!restartForm &&
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                style={{ float: 'right' }}
                                type='submit'
                            >
                                Submit
                            </Button>
                        }
                        {
                            restartForm && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={localStorageCleanUp}
                                    style={{ float: 'right' }}
                                    type='submit'
                                >
                                    Restart form
                                </Button>
                            )
                        }
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <p>Form submitted successfully!</p>
                    </div>
                ) : (
                    <div>
                        {renderStepContent()}
                        <div>
                            <Button disabled={activeStep === 0} onClick={handleBack}>
                                Back
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <MuiAlert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default MultiStepWizard;