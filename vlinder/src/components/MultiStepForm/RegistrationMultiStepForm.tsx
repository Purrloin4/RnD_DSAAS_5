import React, { useState } from 'react';

interface FormData {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
}

const RegisterMultiStepForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
    });

    // Move to next step
    const nextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    // Move to previous step
    const prevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    // Handel data from the form
    const handleChange = (input: keyof FormData, value: string) => {
        setFormData({
            ...formData,
            [input]: value,
        });
    };

    // Submit the form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted', formData);
    };

    return (
        null
    );
};

export default RegisterMultiStepForm