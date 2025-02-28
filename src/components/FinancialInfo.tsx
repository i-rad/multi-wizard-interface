import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";

const financialInfoSchema = z.object({
    monthlySalary: z.number().min(0, 'Monthly salary must be a non-negative number'),
    additionalIncome: z.number().min(0, 'Additional income must be a non-negative number').optional(),
    mortgage: z.number().min(0, 'Mortgage must be a non-negative number').optional(),
    otherCredits: z.number().min(0, 'Other credits must be a non-negative number').optional(),
});

type FinancialInfoData = z.infer<typeof financialInfoSchema>;

const FinancialInfo = ({ handleNext, allFormData }: { handleNext: (data: any) => Promise<void>, allFormData: FinancialInfoData }) => {
    const { register, handleSubmit, formState, getValues } = useForm<FinancialInfoData>({ resolver: zodResolver(financialInfoSchema), defaultValues: allFormData });
    const onSubmit = () => {
        const currentFormData = getValues();
        handleNext(currentFormData);
    };

    const [showAdditionalIncome, setShowAdditionalIncome] = useState(false);
    const [showMortgage, setShowMortgage] = useState(false);
    const [showOtherCredits, setShowOtherCredits] = useState(false);
    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <>
                <TextField
                    label="Monthly Salary"
                    type="number"
                    {...register('monthlySalary', { valueAsNumber: true })}
                    error={!!formState.errors.monthlySalary}
                    helperText={formState.errors.monthlySalary?.message}
                    fullWidth
                    margin="normal"
                />
                <FormControlLabel
                    control={<Checkbox checked={showAdditionalIncome} onChange={(e) => setShowAdditionalIncome(e.target.checked)} />}
                    label="Additional Income"
                />
                {showAdditionalIncome && (
                    <TextField
                        label="Additional Income Amount"
                        type="number"
                        {...register('additionalIncome', { valueAsNumber: true })}
                        helperText={formState.errors.additionalIncome?.message}
                        fullWidth
                        margin="normal"
                    />
                )}
                <FormControlLabel
                    control={<Checkbox checked={showMortgage} onChange={(e) => setShowMortgage(e.target.checked)} />}
                    label="Mortgage"
                />
                {showMortgage && (
                    <TextField
                        label="Mortgage Amount"
                        type="number"
                        {...register('mortgage', { valueAsNumber: true })}
                        error={!!formState.errors.mortgage}
                        helperText={formState.errors.mortgage?.message}
                        fullWidth
                        margin="normal"
                    />
                )}
                <FormControlLabel
                    control={<Checkbox checked={showOtherCredits} onChange={(e) => setShowOtherCredits(e.target.checked)} />}
                    label="Other Credits"
                />
                {showOtherCredits && (
                    <TextField
                        label="Other Credits Amount"
                        type="number"
                        {...register('otherCredits', { valueAsNumber: true })}
                        error={!!formState.errors.otherCredits}
                        helperText={formState.errors.otherCredits?.message}
                        fullWidth
                        margin="normal"
                    />
                )}
            </>
            <Button
                variant="contained"
                color="primary"
                style={{ float: 'right' }}
                type='submit'
            >
                Next
            </Button>
        </form>
    );
};

export default FinancialInfo;
