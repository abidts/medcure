import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/design-system.css';
import '../css/consultation.css';

interface ConsultationFormData {
  specializationId: number;
  patientName: string;
  mobileNumber: string;
  email: string;
  symptoms?: string;
  additionalNotes?: string;
}

interface Specialization {
  id: number;
  name: string;
  description: string;
}

interface ConsultationResponse {
  id: number;
  patientName: string;
  mobileNumber: string;
  email: string;
  specialization: string;
  consultationFee: number;
  status: string;
  verificationCodeVerified: boolean;
  createdAt: string;
}

type FormStep = 'form' | 'verification' | 'success';

const ConsultationBookingForm: React.FC = () => {
  const { specializationId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<FormStep>('form');
  const [specialization, setSpecialization] = useState<Specialization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ConsultationFormData>({
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
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const fetchSpecialization = async () => {
    try {
      const response = await fetch(`/api/specializations/${specializationId}`);
      if (!response.ok) throw new Error('Failed to fetch specialization');
      
      const data = await response.json();
      setSpecialization(data);
      setConsultationFee(getConsultationFee(data.name));
      setError('');
    } catch (err) {
      const errorMsg = 'Failed to load specialization details';
      setError(errorMsg);
      console.error(errorMsg, err);
    }
  };

  const getConsultationFee = (specializationName: string): number => {
    const fees: { [key: string]: number } = {
      'Gynaecology': 499,
      'Cardiology': 599,
      'Dermatology': 399,
      'General': 299,
      'Psychiatry': 449,
      'Pediatrics': 349
    };
    return fees[specializationName] || 499;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMsg);
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid OTP';
      setError(errorMsg);
      console.error('Verification error:', err);
    } finally {
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

      if (!response.ok) throw new Error('Failed to resend OTP');

      setSuccessMessage('OTP resent to your mobile number');
      setResendTimer(60);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
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

  return (
    <div className="consultation-booking-container">
      <div className="container">
        {/* Header */}
        <div className="booking-header animate-fade-in">
          <h1>Book Your Consultation</h1>
          <p className="subtitle">Get expert medical advice from qualified doctors</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step === 'form' ? 'active' : step === 'verification' || step === 'success' ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Your Details</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step === 'verification' ? 'active' : step === 'success' ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Verify OTP</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step === 'success' ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger animate-slide-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="alert alert-success animate-slide-in">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="card animate-fade-in">
            <form onSubmit={handleSubmitForm} className="consultation-form">
              {specialization && (
                <div className="specialization-info">
                  <div className="spec-icon">🏥</div>
                  <div className="spec-details">
                    <h3>{specialization.name}</h3>
                    <p>{specialization.description}</p>
                  </div>
                  <div className="spec-fee">₹{consultationFee}</div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="patientName">Full Name *</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  required
                  disabled={loading}
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="symptoms">Symptoms/Concerns</label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  placeholder="Describe your symptoms or medical concerns..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="additionalNotes">Additional Notes</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional information..."
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span> Processing...
                  </>
                ) : (
                  'Continue to Verification'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Verification Step */}
        {step === 'verification' && (
          <div className="card animate-fade-in">
            <form onSubmit={handleVerifyOTP} className="verification-form">
              <div className="verification-header">
                <h2>Verify Your Mobile Number</h2>
                <p>We've sent a 6-digit OTP to {formData.mobileNumber}</p>
              </div>

              <div className="form-group">
                <label htmlFor="verificationCode">Enter OTP *</label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading}
                  className="otp-input"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span> Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="resend-container">
                <span>Didn't receive OTP?</span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || resendLoading}
                  className="btn btn-ghost"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="card success-card animate-fade-in">
            <div className="success-container">
              <div className="success-icon">✓</div>
              <h2>Booking Confirmed!</h2>
              <p className="success-message">Your consultation has been successfully booked</p>

              <div className="confirmation-details">
                <div className="detail-item">
                  <span className="detail-label">Booking ID</span>
                  <span className="detail-value">#{bookingId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Specialization</span>
                  <span className="detail-value">{specialization?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Consultation Fee</span>
                  <span className="detail-value">₹{consultationFee}</span>
                </div>
              </div>

              <div className="next-steps">
                <h3>What's Next?</h3>
                <ul>
                  <li>✓ You'll receive a call from our coordination team shortly</li>
                  <li>✓ Schedule your consultation at a convenient time</li>
                  <li>✓ Connect with the doctor via video call on the scheduled time</li>
                </ul>
              </div>

              <div className="button-group">
                <button onClick={handleStartNew} className="btn btn-secondary btn-lg btn-full">
                  Book Another Consultation
                </button>
                <button onClick={() => navigate('/')} className="btn btn-outline btn-lg btn-full">
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationBookingForm;
