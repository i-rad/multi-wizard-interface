import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";

const contactDetailsSchema = z.object({
    email: z.string().email('Invalid email format'),
    phone: z
        .string()
        .min(10)
        .regex(/^\+[1-9]\d{1,14}$/, 'Invalid E.164 phone number format'),
});

type ContactDetailsData = z.infer<typeof contactDetailsSchema>;

const ContactDetails = ({ handleNext, allFormData }: { handleNext: (data: any) => Promise<void>, allFormData: ContactDetailsData }) => {
    const { register, handleSubmit, formState, getValues } = useForm<ContactDetailsData>({ resolver: zodResolver(contactDetailsSchema), defaultValues: allFormData });
    const onSubmit = () => {
        const currentFormData = getValues();
        handleNext(currentFormData);
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="Email"
                {...register('email')}
                error={!!formState.errors.email}
                helperText={formState.errors.email?.message}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Phone number"
                {...register('phone')}
                error={!!formState.errors.phone}
                helperText={formState.errors.phone?.message}
                fullWidth
                margin="normal"
            />
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

export default ContactDetails;
