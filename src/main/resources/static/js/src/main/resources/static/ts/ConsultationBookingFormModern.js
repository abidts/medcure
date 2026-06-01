import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/design-system.css';
import '../css/consultation.css';
const ConsultationBookingForm = () => {
    const { specializationId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState('form');
    const [specialization, setSpecialization] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
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
    const [resendTimer, setResendTimer] = useState(0);
    useEffect(() => {
        fetchSpecialization();
    }, [specializationId]);
    // Timer for resend
    useEffect(() => {
        if (resendTimer <= 0)
            return;
        const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendTimer]);
    const fetchSpecialization = async () => {
        try {
            const response = await fetch(`/api/specializations/${specializationId}`);
            if (!response.ok)
                throw new Error('Failed to fetch specialization');
            const data = await response.json();
            setSpecialization(data);
            setConsultationFee(getConsultationFee(data.name));
            setError('');
        }
        catch (err) {
            const errorMsg = 'Failed to load specialization details';
            setError(errorMsg);
            console.error(errorMsg, err);
        }
    };
    const getConsultationFee = (specializationName) => {
        const fees = {
            'Gynaecology': 499,
            'Cardiology': 599,
            'Dermatology': 399,
            'General': 299,
            'Psychiatry': 449,
            'Pediatrics': 349
        };
        return fees[specializationName] || 499;
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const validateForm = () => {
        if (!formData.patientName.trim()) {
            setError('Patient name is required');
            return false;
        }
        if (!formData.mobileNumber.trim()) {
            setError('Mobile number is required');
            return false;
        }
        if (!/^\d{10}$/.test(formData.mobileNumber)) {
            setError('Mobile number must be 10 digits');
            return false;
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email address');
            return false;
        }
        setError('');
        return true;
    };
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/consultations/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to create booking');
            }
            setBookingId(result.data.id);
            setSuccessMessage('Booking created! OTP sent to your mobile');
            setStep('verification');
            setResendTimer(60);
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to create booking';
            setError(errorMsg);
            console.error('Form submission error:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!verificationCode.trim()) {
            setError('Please enter the OTP');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/consultations/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    consultationBookingId: bookingId,
                    verificationCode: verificationCode.trim()
                })
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Invalid OTP');
            }
            setSuccessMessage('Mobile verified successfully!');
            setStep('success');
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Invalid OTP';
            setError(errorMsg);
            console.error('Verification error:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleResendOTP = async () => {
        setResendLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/consultations/${bookingId}/resend-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok)
                throw new Error('Failed to resend OTP');
            setSuccessMessage('OTP resent to your mobile number');
            setResendTimer(60);
        }
        catch (err) {
            setError('Failed to resend OTP. Please try again.');
        }
        finally {
            setResendLoading(false);
        }
    };
    const handleStartNew = () => {
        setStep('form');
        setFormData({
            specializationId: parseInt(specializationId || '1'),
            patientName: '',
            mobileNumber: '',
            email: '',
            symptoms: '',
            additionalNotes: ''
        });
        setVerificationCode('');
        setBookingId(null);
        setError('');
        setSuccessMessage('');
    };
    return (_jsx("div", { className: "consultation-booking-container", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "booking-header animate-fade-in", children: [_jsx("h1", { children: "Book Your Consultation" }), _jsx("p", { className: "subtitle", children: "Get expert medical advice from qualified doctors" })] }), _jsxs("div", { className: "progress-steps", children: [_jsxs("div", { className: `step ${step === 'form' ? 'active' : step === 'verification' || step === 'success' ? 'completed' : ''}`, children: [_jsx("div", { className: "step-number", children: "1" }), _jsx("div", { className: "step-label", children: "Your Details" })] }), _jsx("div", { className: "step-line" }), _jsxs("div", { className: `step ${step === 'verification' ? 'active' : step === 'success' ? 'completed' : ''}`, children: [_jsx("div", { className: "step-number", children: "2" }), _jsx("div", { className: "step-label", children: "Verify OTP" })] }), _jsx("div", { className: "step-line" }), _jsxs("div", { className: `step ${step === 'success' ? 'active' : ''}`, children: [_jsx("div", { className: "step-number", children: "3" }), _jsx("div", { className: "step-label", children: "Confirmation" })] })] }), error && (_jsxs("div", { className: "alert alert-danger animate-slide-in", children: [_jsx("span", { children: "\u26A0\uFE0F" }), _jsx("span", { children: error })] })), successMessage && (_jsxs("div", { className: "alert alert-success animate-slide-in", children: [_jsx("span", { children: "\u2713" }), _jsx("span", { children: successMessage })] })), step === 'form' && (_jsx("div", { className: "card animate-fade-in", children: _jsxs("form", { onSubmit: handleSubmitForm, className: "consultation-form", children: [specialization && (_jsxs("div", { className: "specialization-info", children: [_jsx("div", { className: "spec-icon", children: "\uD83C\uDFE5" }), _jsxs("div", { className: "spec-details", children: [_jsx("h3", { children: specialization.name }), _jsx("p", { children: specialization.description })] }), _jsxs("div", { className: "spec-fee", children: ["\u20B9", consultationFee] })] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "patientName", children: "Full Name *" }), _jsx("input", { type: "text", id: "patientName", name: "patientName", value: formData.patientName, onChange: handleInputChange, placeholder: "Enter your full name", required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "mobileNumber", children: "Mobile Number *" }), _jsx("input", { type: "tel", id: "mobileNumber", name: "mobileNumber", value: formData.mobileNumber, onChange: handleInputChange, placeholder: "10-digit mobile number", required: true, disabled: loading, maxLength: 10 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email Address" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, placeholder: "your.email@example.com", disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "symptoms", children: "Symptoms/Concerns" }), _jsx("textarea", { id: "symptoms", name: "symptoms", value: formData.symptoms, onChange: handleInputChange, placeholder: "Describe your symptoms or medical concerns...", disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "additionalNotes", children: "Additional Notes" }), _jsx("textarea", { id: "additionalNotes", name: "additionalNotes", value: formData.additionalNotes, onChange: handleInputChange, placeholder: "Any additional information...", disabled: loading })] }), _jsx("button", { type: "submit", className: "btn btn-primary btn-lg btn-full", disabled: loading, children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "animate-spin", children: "\u27F3" }), " Processing..."] })) : ('Continue to Verification') })] }) })), step === 'verification' && (_jsx("div", { className: "card animate-fade-in", children: _jsxs("form", { onSubmit: handleVerifyOTP, className: "verification-form", children: [_jsxs("div", { className: "verification-header", children: [_jsx("h2", { children: "Verify Your Mobile Number" }), _jsxs("p", { children: ["We've sent a 6-digit OTP to ", formData.mobileNumber] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "verificationCode", children: "Enter OTP *" }), _jsx("input", { type: "text", id: "verificationCode", value: verificationCode, onChange: (e) => setVerificationCode(e.target.value.slice(0, 6)), placeholder: "000000", maxLength: 6, disabled: loading, className: "otp-input" })] }), _jsx("button", { type: "submit", className: "btn btn-primary btn-lg btn-full", disabled: loading, children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "animate-spin", children: "\u27F3" }), " Verifying..."] })) : ('Verify OTP') }), _jsxs("div", { className: "resend-container", children: [_jsx("span", { children: "Didn't receive OTP?" }), _jsx("button", { type: "button", onClick: handleResendOTP, disabled: resendTimer > 0 || resendLoading, className: "btn btn-ghost", children: resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP' })] })] }) })), step === 'success' && (_jsx("div", { className: "card success-card animate-fade-in", children: _jsxs("div", { className: "success-container", children: [_jsx("div", { className: "success-icon", children: "\u2713" }), _jsx("h2", { children: "Booking Confirmed!" }), _jsx("p", { className: "success-message", children: "Your consultation has been successfully booked" }), _jsxs("div", { className: "confirmation-details", children: [_jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "Booking ID" }), _jsxs("span", { className: "detail-value", children: ["#", bookingId] })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "Specialization" }), _jsx("span", { className: "detail-value", children: specialization?.name })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "Consultation Fee" }), _jsxs("span", { className: "detail-value", children: ["\u20B9", consultationFee] })] })] }), _jsxs("div", { className: "next-steps", children: [_jsx("h3", { children: "What's Next?" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2713 You'll receive a call from our coordination team shortly" }), _jsx("li", { children: "\u2713 Schedule your consultation at a convenient time" }), _jsx("li", { children: "\u2713 Connect with the doctor via video call on the scheduled time" })] })] }), _jsxs("div", { className: "button-group", children: [_jsx("button", { onClick: handleStartNew, className: "btn btn-secondary btn-lg btn-full", children: "Book Another Consultation" }), _jsx("button", { onClick: () => navigate('/'), className: "btn btn-outline btn-lg btn-full", children: "Back to Home" })] })] }) }))] }) }));
};
export default ConsultationBookingForm;
//# sourceMappingURL=ConsultationBookingFormModern.js.map