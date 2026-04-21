import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/consultation.css';
const ConsultationBookingForm = () => {
    const { specializationId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState('form');
    const [specialization, setSpecialization] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [consultationFee, setConsultationFee] = useState(0);
    const [bookingId, setBookingId] = useState(null);
    const [formData, setFormData] = useState({
        specializationId: parseInt(specializationId || '1'),
        patientName: '',
        mobileNumber: '',
        email: '',
        symptoms: '',
        additionalNotes: ''
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    useEffect(() => {
        fetchSpecialization();
    }, [specializationId]);
    const fetchSpecialization = async () => {
        try {
            const response = await fetch(`/api/specializations/${specializationId}`);
            const data = await response.json();
            setSpecialization(data);
            // Get consultation fee based on specialization
            setConsultationFee(getConsultationFee(data.name));
        }
        catch (error) {
            console.error('Error fetching specialization:', error);
            setError('Failed to load specialization details');
        }
    };
    const getConsultationFee = (specializationName) => {
        const fees = {
            'Gynaecology': 499,
            'Cardiology': 599,
            'Dermatology': 399,
            'General': 299
        };
        return fees[specializationName] || 499;
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/consultations/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setBookingId(data.data.id);
                setStep('verification');
            }
            else {
                setError(data.message || 'Failed to create booking');
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/consultations/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    consultationBookingId: bookingId,
                    verificationCode: verificationCode
                })
            });
            const data = await response.json();
            if (data.success) {
                // Auto-confirm after verification
                const confirmResponse = await fetch(`/api/consultations/${bookingId}/confirm`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const confirmData = await confirmResponse.json();
                if (confirmData.success) {
                    setStep('success');
                }
            }
            else {
                setError(data.message || 'Invalid verification code');
            }
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    const handleResendCode = async () => {
        setResendLoading(true);
        try {
            const response = await fetch(`/api/consultations/${bookingId}/resend-code`, {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success) {
                setError('');
                alert('Verification code resent to your mobile number');
            }
        }
        catch (err) {
            setError('Failed to resend code');
        }
        finally {
            setResendLoading(false);
        }
    };
    if (step === 'form') {
        return (_jsxs("div", { className: "consultation-booking-container", children: [_jsx("button", { className: "close-btn", onClick: () => navigate('/'), children: "\u00D7" }), _jsxs("div", { className: "consultation-form-wrapper", children: [_jsxs("div", { className: "form-section", children: [_jsx("h2", { children: "Consult with a Doctor" }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleSubmitForm, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Speciality" }), specialization && (_jsxs("div", { className: "specialization-select", children: [_jsx("input", { type: "checkbox", checked: true, readOnly: true }), _jsx("span", { className: "spec-name", children: specialization.name }), _jsxs("span", { className: "spec-fee", children: ["\u20B9", consultationFee] })] }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "patientName", children: "Patient name" }), _jsx("input", { type: "text", id: "patientName", name: "patientName", placeholder: "Enter patient name for prescriptions", value: formData.patientName, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "mobileNumber", children: "Mobile number" }), _jsxs("div", { className: "mobile-input-wrapper", children: [_jsx("select", { className: "country-code", children: _jsx("option", { value: "+91", children: "\uD83C\uDDEE\uD83C\uDDF3 +91" }) }), _jsx("input", { type: "tel", id: "mobileNumber", name: "mobileNumber", placeholder: "Enter mobile number", value: formData.mobileNumber, onChange: handleInputChange, required: true })] }), _jsx("small", { children: "A verification code will be sent to this number." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email (Optional)" }), _jsx("input", { type: "email", id: "email", name: "email", placeholder: "Enter email address", value: formData.email, onChange: handleInputChange })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "symptoms", children: "Symptoms (Optional)" }), _jsx("textarea", { id: "symptoms", name: "symptoms", placeholder: "Describe your symptoms", value: formData.symptoms, onChange: handleInputChange, rows: 3 })] }), _jsx("button", { type: "submit", className: "continue-btn", disabled: loading, children: loading ? 'Processing...' : 'Continue' })] })] }), _jsxs("div", { className: "security-section", children: [_jsx("div", { className: "security-badge", children: "\uD83D\uDD12" }), _jsx("h3", { children: "Private & Secure" }), _jsx("p", { children: "Your health information is protected and encrypted" })] })] })] }));
    }
    if (step === 'verification') {
        return (_jsxs("div", { className: "consultation-booking-container", children: [_jsx("button", { className: "close-btn", onClick: () => navigate('/'), children: "\u00D7" }), _jsxs("div", { className: "consultation-form-wrapper", children: [_jsxs("div", { className: "form-section", children: [_jsx("h2", { children: "Verify Your Mobile Number" }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("p", { className: "verification-text", children: ["We've sent a 6-digit verification code to ", formData.mobileNumber] }), _jsxs("form", { onSubmit: handleVerifyCode, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "verificationCode", children: "Enter verification code" }), _jsx("input", { type: "text", id: "verificationCode", placeholder: "000000", value: verificationCode, onChange: (e) => setVerificationCode(e.target.value), maxLength: 6, required: true })] }), _jsx("button", { type: "submit", className: "continue-btn", disabled: loading, children: loading ? 'Verifying...' : 'Verify' }), _jsx("button", { type: "button", className: "resend-btn", onClick: handleResendCode, disabled: resendLoading, children: resendLoading ? 'Resending...' : "Didn't receive code? Resend" })] })] }), _jsxs("div", { className: "security-section", children: [_jsx("div", { className: "security-badge", children: "\uD83D\uDD12" }), _jsx("h3", { children: "Private & Secure" }), _jsx("p", { children: "Your verification is secure and encrypted" })] })] })] }));
    }
    if (step === 'success') {
        return (_jsx("div", { className: "consultation-success-container", children: _jsxs("div", { className: "success-card", children: [_jsx("div", { className: "success-icon", children: "\u2713" }), _jsx("h2", { children: "Consultation Booking Confirmed!" }), _jsx("p", { children: "Your consultation booking has been confirmed" }), _jsxs("div", { className: "booking-details", children: [_jsxs("p", { children: [_jsx("strong", { children: "Booking ID:" }), " ", bookingId] }), _jsxs("p", { children: [_jsx("strong", { children: "Specialization:" }), " ", specialization?.name] }), _jsxs("p", { children: [_jsx("strong", { children: "Consultation Fee:" }), " \u20B9", consultationFee] }), _jsxs("p", { children: [_jsx("strong", { children: "Status:" }), " Confirmed"] })] }), _jsx("p", { className: "next-steps", children: "A doctor will contact you shortly to schedule your consultation." }), _jsx("button", { className: "back-to-home-btn", onClick: () => navigate('/'), children: "Back to Home" })] }) }));
    }
    return null;
};
export default ConsultationBookingForm;
//# sourceMappingURL=ConsultationBookingForm.js.map