import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";

const loanRequestSchema = z
    .object({
        loanAmount: z
            .number()
            .min(10000, 'Loan amount must be at least 10,000')
            .max(70000, 'Loan amount must be at most 70,000'),
        upfrontPayment: z.number(),
        terms: z
            .number()
            .min(10, 'Terms must be at least 10 months')
            .max(30, 'Terms must be at most 30 months'),
    })
    .refine(
        (data) => data.upfrontPayment < data.loanAmount,
        {
            message: 'Upfront payment must be less than the loan amount',
            path: ['upfrontPayment'], // Specify the field where the error should appear
        }
    );

type LoanRequestData = z.infer<typeof loanRequestSchema>;

const LoanRequest = ({ handleNext, allFormData }: { handleNext: (data: any) => Promise<void>, allFormData: LoanRequestData }) => {
    const { register, handleSubmit, formState, getValues } = useForm<LoanRequestData>({ resolver: zodResolver(loanRequestSchema), defaultValues: allFormData });
    const onSubmit = () => {
        const currentFormData = getValues();
        handleNext(currentFormData);
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <>
                <TextField
                    label="Loan amount"
                    {...register('loanAmount', { valueAsNumber: true })}
                    error={!!formState.errors.loanAmount}
                    helperText={formState.errors.loanAmount?.message}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Upfront Payment"
                    type="number"
                    {...register('upfrontPayment', { valueAsNumber: true })}
                    error={!!formState.errors.upfrontPayment}
                    helperText={formState.errors.upfrontPayment?.message}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Terms"
                    type="number"
                    {...register('terms', { valueAsNumber: true })}
                    error={!!formState.errors.terms}
                    helperText={formState.errors.terms?.message}
                    fullWidth
                    margin="normal"
                />
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

export default LoanRequest;
