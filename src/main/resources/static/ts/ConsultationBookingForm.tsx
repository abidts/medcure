import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
}

const ConsultationBookingForm: React.FC = () => {
  const { specializationId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form');
  const [specialization, setSpecialization] = useState<Specialization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    } catch (error) {
      console.error('Error fetching specialization:', error);
      setError('Failed to load specialization details');
    }
  };

  const getConsultationFee = (specializationName: string): number => {
    const fees: { [key: string]: number } = {
      'Gynaecology': 499,
      'Cardiology': 599,
      'Dermatology': 399,
      'General': 299
    };
    return fees[specializationName] || 499;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
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
      } else {
        setError(data.message || 'Failed to create booking');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
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
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
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
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  if (step === 'form') {
    return (
      <div className="consultation-booking-container">
        <button className="close-btn" onClick={() => navigate('/')}>×</button>

        <div className="consultation-form-wrapper">
          <div className="form-section">
            <h2>Consult with a Doctor</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmitForm}>
              <div className="form-group">
                <label>Speciality</label>
                {specialization && (
                  <div className="specialization-select">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                    />
                    <span className="spec-name">{specialization.name}</span>
                    <span className="spec-fee">₹{consultationFee}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="patientName">Patient name</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  placeholder="Enter patient name for prescriptions"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile number</label>
                <div className="mobile-input-wrapper">
                  <select className="country-code">
                    <option value="+91">🇮🇳 +91</option>
                  </select>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="Enter mobile number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <small>A verification code will be sent to this number.</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="symptoms">Symptoms (Optional)</label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="Describe your symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="continue-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </form>
          </div>

          <div className="security-section">
            <div className="security-badge">🔒</div>
            <h3>Private & Secure</h3>
            <p>Your health information is protected and encrypted</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'verification') {
    return (
      <div className="consultation-booking-container">
        <button className="close-btn" onClick={() => navigate('/')}>×</button>

        <div className="consultation-form-wrapper">
          <div className="form-section">
            <h2>Verify Your Mobile Number</h2>

            {error && <div className="error-message">{error}</div>}

            <p className="verification-text">
              We've sent a 6-digit verification code to {formData.mobileNumber}
            </p>

            <form onSubmit={handleVerifyCode}>
              <div className="form-group">
                <label htmlFor="verificationCode">Enter verification code</label>
                <input
                  type="text"
                  id="verificationCode"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="continue-btn"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>

              <button
                type="button"
                className="resend-btn"
                onClick={handleResendCode}
                disabled={resendLoading}
              >
                {resendLoading ? 'Resending...' : "Didn't receive code? Resend"}
              </button>
            </form>
          </div>

          <div className="security-section">
            <div className="security-badge">🔒</div>
            <h3>Private & Secure</h3>
            <p>Your verification is secure and encrypted</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="consultation-success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Consultation Booking Confirmed!</h2>
          <p>Your consultation booking has been confirmed</p>
          
          <div className="booking-details">
            <p><strong>Booking ID:</strong> {bookingId}</p>
            <p><strong>Specialization:</strong> {specialization?.name}</p>
            <p><strong>Consultation Fee:</strong> ₹{consultationFee}</p>
            <p><strong>Status:</strong> Confirmed</p>
          </div>

          <p className="next-steps">A doctor will contact you shortly to schedule your consultation.</p>

          <button
            className="back-to-home-btn"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ConsultationBookingForm;
