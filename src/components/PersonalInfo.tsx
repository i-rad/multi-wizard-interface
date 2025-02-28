import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const personalInfoSchema = z.object({
    firstName: z
        .string()
        .regex(/^[a-zA-ZäöüÄÖÜß]+$/, 'Only Latin and German letters allowed, single name')
        .min(2, 'First name is required'),
    lastName: z
        .string()
        .regex(/^[a-zA-ZäöüÄÖÜß\s-]+$/, 'Only Latin and German letters allowed')
        .min(2, 'Last name is required'),
    dateOfBirth: z
        .date()
        .min(dayjs().subtract(79, 'year').toDate(), 'Maximum age is 79 years'),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;

const PersonalInfo = ({ handleNext, allFormData }: { handleNext: (data: any) => Promise<void>, allFormData: PersonalInfoData }) => {
    const { register, handleSubmit, formState, control, getValues } = useForm<PersonalInfoData>({ resolver: zodResolver(personalInfoSchema), defaultValues: allFormData });
    const onSubmit = () => {
        const currentFormData = getValues();
        handleNext(currentFormData);
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="First Name"
                {...register('firstName')}
                error={!!formState.errors.firstName}
                helperText={formState.errors.firstName?.message}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Last Name"
                {...register('lastName')}
                error={!!formState.errors.lastName}
                helperText={formState.errors.lastName?.message}
                fullWidth
                margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <div>
                            <DatePicker
                                label="Date of Birth"
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(newValue) => field.onChange(newValue ? newValue.toDate() : null)}
                            />
                            {formState.errors.dateOfBirth?.message}</div>
                    )}
                />
            </LocalizationProvider>

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

export default PersonalInfo;
