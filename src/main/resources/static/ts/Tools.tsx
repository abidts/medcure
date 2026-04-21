import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, Activity, Baby, Heart, Flame, 
  Droplets, Gauge, Percent, Ruler, Clock, 
  Droplet, TrendingUp, Circle, ChevronRight, ArrowLeft,
  Baby as BabyIcon, Sun, Activity as ActivityIcon, Info,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  popular?: boolean;
}

const tools: Tool[] = [
  { id: 'bmi', name: 'BMI Calculator', description: 'Calculate your Body Mass Index to assess weight status', icon: <Calculator size={24} />, category: 'fitness', popular: true },
  { id: 'bmr', name: 'BMR Calculator', description: 'Calculate your Basal Metabolic Rate for daily calorie needs', icon: <Flame size={24} />, category: 'fitness', popular: true },
  { id: 'calories', name: 'Calories Calculator', description: 'Estimate daily caloric requirements based on activity level', icon: <Activity size={24} />, category: 'fitness' },
  { id: 'duedate', name: 'Due Date Calculator', description: 'Calculate estimated delivery date for pregnancy', icon: <Baby size={24} />, category: 'pregnancy', popular: true },
  { id: 'ovulation', name: 'Ovulation Calculator', description: 'Track your fertile window and ovulation period', icon: <Clock size={24} />, category: 'pregnancy' },
  { id: 'bloodpressure', name: 'Blood Pressure Calculator', description: 'Assess blood pressure readings and cardiovascular risk', icon: <Gauge size={24} />, category: 'heart' },
  { id: 'diabetes', name: 'Diabetes Risk Calculator', description: 'Evaluate your risk factors for developing diabetes', icon: <Droplet size={24} />, category: 'diabetes' },
  { id: 'heartrate', name: 'Heart Rate Calculator', description: 'Calculate target heart rate zones for optimal exercise', icon: <Heart size={24} />, category: 'heart' },
  { id: 'bodyfat', name: 'Body Fat Calculator', description: 'Estimate body fat percentage using various methods', icon: <Percent size={24} />, category: 'fitness' },
  { id: 'waisthip', name: 'Waist-Hip Ratio Calculator', description: 'Calculate waist-to-hip ratio for health assessment', icon: <Ruler size={24} />, category: 'fitness' },
  { id: 'egfr', name: 'eGFR Calculator', description: 'Estimate glomerular filtration rate for kidney function', icon: <ActivityIcon size={24} />, category: 'general' },
  { id: 'map', name: 'MAP Calculator', description: 'Calculate Mean Arterial Pressure for cardiovascular health', icon: <TrendingUp size={24} />, category: 'heart' },
  { id: 'lipid', name: 'Lipid Profile Calculator', description: 'Calculate cholesterol ratios and cardiovascular risk', icon: <Droplets size={24} />, category: 'heart' },
  { id: 'anemia', name: 'Anemia Risk Calculator', description: 'Assess risk factors and symptoms of anemia', icon: <Circle size={24} />, category: 'general' },
  { id: 'growth', name: 'Child Growth Calculator', description: 'Track child development with growth percentiles', icon: <BabyIcon size={24} />, category: 'general' },
  { id: 'vitamind', name: 'Vitamin D Risk Calculator', description: 'Assess vitamin D deficiency risk factors', icon: <Sun size={24} />, category: 'general' },
  { id: 'framingham', name: 'Framingham Risk Calculator', description: 'Calculate 10-year cardiovascular disease risk', icon: <Heart size={24} />, category: 'heart' },
  { id: 'hba1c', name: 'HbA1c Calculator', description: 'Convert between HbA1c values and average glucose', icon: <Droplet size={24} />, category: 'diabetes' },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  fitness: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  pregnancy: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  heart: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  diabetes: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  general: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
};

// Calculator Components
const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmi = w / (h * h);
      let category = '';
      let color = '';
      if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500'; }
      else if (bmi < 25) { category = 'Normal weight'; color = 'text-green-500'; }
      else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-500'; }
      else { category = 'Obese'; color = 'text-red-500'; }
      setResult({ bmi: parseFloat(bmi.toFixed(1)), category, color });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="e.g., 170" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="e.g., 70" />
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">Calculate BMI</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-slate-900">{result.bmi}</p>
          <p className={`text-lg font-semibold ${result.color}`}>{result.category}</p>
        </div>
      )}
    </div>
  );
};

const BMRCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (a > 0 && h > 0 && w > 0) {
      let bmr = 0;
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
      } else {
        bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
      }
      setResult(Math.round(bmr));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Female</button>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Age (years)</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="e.g., 30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="e.g., 170" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="e.g., 70" />
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">Calculate BMR</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-sm text-slate-500">Daily calorie needs at rest</p>
          <p className="text-3xl font-bold text-slate-900">{result} kcal/day</p>
        </div>
      )}
    </div>
  );
};

const CaloriesCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('1.2');
  const [result, setResult] = useState<number | null>(null);

  const activityLevels = [
    { value: '1.2', label: 'Sedentary (little/no exercise)' },
    { value: '1.375', label: 'Lightly active (1-3 days/week)' },
    { value: '1.55', label: 'Moderately active (3-5 days/week)' },
    { value: '1.725', label: 'Very active (6-7 days/week)' },
    { value: '1.9', label: 'Extra active (physical job/training)' },
  ];

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const act = parseFloat(activity);
    if (a > 0 && h > 0 && w > 0) {
      let bmr = gender === 'male' 
        ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
        : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
      setResult(Math.round(bmr * act));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Female</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none" placeholder="30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none" placeholder="170" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none" placeholder="70" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Activity Level</label>
        <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white">
          {activityLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">Calculate Calories</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-sm text-slate-500">Daily calorie needs</p>
          <p className="text-3xl font-bold text-slate-900">{result} kcal/day</p>
        </div>
      )}
    </div>
  );
};

const DueDateCalculator: React.FC = () => {
  const [lmp, setLmp] = useState('');
  const [result, setResult] = useState<{ dueDate: string; weeks: number } | null>(null);

  const calculate = () => {
    if (lmp) {
      const lmpDate = new Date(lmp);
      const dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + 280);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
      const weeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      setResult({ 
        dueDate: dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        weeks: Math.min(weeks, 40)
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">First Day of Last Menstrual Period (LMP)</label>
        <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
      </div>
      <button onClick={calculate} className="w-full py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors">Calculate Due Date</button>
      {result && (
        <div className="p-4 bg-pink-50 rounded-xl text-center">
          <p className="text-sm text-pink-600">Estimated Due Date</p>
          <p className="text-2xl font-bold text-slate-900">{result.dueDate}</p>
          <p className="text-sm text-slate-500 mt-2">Currently ~{result.weeks} weeks pregnant</p>
        </div>
      )}
    </div>
  );
};

const OvulationCalculator: React.FC = () => {
  const [lmp, setLmp] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [result, setResult] = useState<{ ovulation: string; fertileStart: string; fertileEnd: string } | null>(null);

  const calculate = () => {
    if (lmp) {
      const lmpDate = new Date(lmp);
      const cycle = parseInt(cycleLength);
      const ovulationDate = new Date(lmpDate);
      ovulationDate.setDate(ovulationDate.getDate() + (cycle - 14));
      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(fertileStart.getDate() - 5);
      const fertileEnd = new Date(ovulationDate);
      fertileEnd.setDate(fertileEnd.getDate() + 1);
      
      setResult({
        ovulation: ovulationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fertileStart: fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fertileEnd: fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">First Day of Last Period</label>
        <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Average Cycle Length (days)</label>
        <input type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" />
      </div>
      <button onClick={calculate} className="w-full py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors">Calculate</button>
      {result && (
        <div className="p-4 bg-pink-50 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Ovulation Date:</span>
            <span className="font-semibold text-pink-600">{result.ovulation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Fertile Window:</span>
            <span className="font-semibold">{result.fertileStart} - {result.fertileEnd}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const BloodPressureCalculator: React.FC = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [result, setResult] = useState<{ category: string; color: string; advice: string } | null>(null);

  const calculate = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    if (sys > 0 && dia > 0) {
      let category = '';
      let color = '';
      let advice = '';
      if (sys < 90 || dia < 60) {
        category = 'Low Blood Pressure';
        color = 'text-yellow-500';
        advice = 'May cause dizziness. Consult doctor if symptomatic.';
      } else if (sys < 120 && dia < 80) {
        category = 'Normal';
        color = 'text-green-500';
        advice = 'Keep maintaining a healthy lifestyle.';
      } else if (sys < 130 && dia < 80) {
        category = 'Elevated';
        color = 'text-yellow-500';
        advice = 'Consider lifestyle changes to prevent hypertension.';
      } else if (sys < 140 || dia < 90) {
        category = 'Stage 1 Hypertension';
        color = 'text-orange-500';
        advice = 'Consult your healthcare provider for management.';
      } else {
        category = 'Stage 2 Hypertension';
        color = 'text-red-500';
        advice = 'Seek medical attention for proper treatment.';
      }
      setResult({ category, color, advice });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Systolic (mmHg)</label>
          <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="120" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Diastolic (mmHg)</label>
          <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="80" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">Assess Blood Pressure</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className={`text-xl font-bold ${result.color}`}>{result.category}</p>
          <p className="text-sm text-slate-600 mt-2">{result.advice}</p>
        </div>
      )}
    </div>
  );
};

const DiabetesRiskCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState('');
  const [familyHistory, setFamilyHistory] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [result, setResult] = useState<{ risk: string; color: string; score: number } | null>(null);

  const calculate = () => {
    let score = 0;
    const ageNum = parseInt(age);
    const bmiNum = parseFloat(bmi);
    
    if (ageNum >= 45) score += 2;
    else if (ageNum >= 35) score += 1;
    if (bmiNum >= 30) score += 2;
    else if (bmiNum >= 25) score += 1;
    if (familyHistory) score += 2;
    if (inactive) score += 1;

    let risk = '';
    let color = '';
    if (score <= 2) { risk = 'Low Risk'; color = 'text-green-500'; }
    else if (score <= 5) { risk = 'Moderate Risk'; color = 'text-yellow-500'; }
    else { risk = 'High Risk'; color = 'text-red-500'; }
    
    setResult({ risk, color, score });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g., 45" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">BMI</label>
          <input type="number" value={bmi} onChange={(e) => setBmi(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g., 28" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={familyHistory} onChange={(e) => setFamilyHistory(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-slate-700">Family history of diabetes</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={inactive} onChange={(e) => setInactive(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-slate-700">Physically inactive</span>
      </label>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">Calculate Risk</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className={`text-2xl font-bold ${result.color}`}>{result.risk}</p>
          <p className="text-sm text-slate-500">Risk Score: {result.score}/7</p>
        </div>
      )}
    </div>
  );
};

const HeartRateCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [result, setResult] = useState<{ max: number; targetMin: number; targetMax: number } | null>(null);

  const calculate = () => {
    const a = parseInt(age);
    if (a > 0) {
      const max = 220 - a;
      setResult({
        max,
        targetMin: Math.round(max * 0.5),
        targetMax: Math.round(max * 0.85),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Age (years)</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g., 30" />
      </div>
      <button onClick={calculate} className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">Calculate Heart Rate Zones</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Maximum Heart Rate:</span>
            <span className="font-bold">{result.max} bpm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Target Zone:</span>
            <span className="font-bold text-red-600">{result.targetMin} - {result.targetMax} bpm</span>
          </div>
        </div>
      )}
    </div>
  );
};

const BodyFatCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{ bodyFat: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    const hp = parseFloat(hip);
    
    if (w > 0 && n > 0 && h > 0) {
      let bodyFat = 0;
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      } else {
        if (hp > 0) {
          bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
        }
      }
      
      const bf = parseFloat(bodyFat.toFixed(1));
      let category = '';
      let color = '';
      
      if (gender === 'male') {
        if (bf < 6) { category = 'Essential Fat'; color = 'text-blue-500'; }
        else if (bf < 14) { category = 'Athletes'; color = 'text-green-500'; }
        else if (bf < 18) { category = 'Fitness'; color = 'text-emerald-500'; }
        else if (bf < 25) { category = 'Average'; color = 'text-yellow-500'; }
        else { category = 'Obese'; color = 'text-red-500'; }
      } else {
        if (bf < 14) { category = 'Essential Fat'; color = 'text-blue-500'; }
        else if (bf < 21) { category = 'Athletes'; color = 'text-green-500'; }
        else if (bf < 25) { category = 'Fitness'; color = 'text-emerald-500'; }
        else if (bf < 32) { category = 'Average'; color = 'text-yellow-500'; }
        else { category = 'Obese'; color = 'text-red-500'; }
      }
      
      setResult({ bodyFat: bf, category, color });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}>Female</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Waist (cm)</label>
          <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Neck (cm)</label>
          <input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
        {gender === 'female' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Hip (cm)</label>
            <input type="number" value={hip} onChange={(e) => setHip(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">Calculate Body Fat</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-slate-900">{result.bodyFat}%</p>
          <p className={`text-lg font-semibold ${result.color}`}>{result.category}</p>
        </div>
      )}
    </div>
  );
};

const WaistHipCalculator: React.FC = () => {
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{ ratio: number; risk: string; color: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(waist);
    const h = parseFloat(hip);
    if (w > 0 && h > 0) {
      const ratio = w / h;
      const r = parseFloat(ratio.toFixed(2));
      let risk = '';
      let color = '';
      
      if (gender === 'male') {
        if (r < 0.9) { risk = 'Low Risk'; color = 'text-green-500'; }
        else if (r < 0.95) { risk = 'Moderate Risk'; color = 'text-yellow-500'; }
        else { risk = 'High Risk'; color = 'text-red-500'; }
      } else {
        if (r < 0.8) { risk = 'Low Risk'; color = 'text-green-500'; }
        else if (r < 0.85) { risk = 'Moderate Risk'; color = 'text-yellow-500'; }
        else { risk = 'High Risk'; color = 'text-red-500'; }
      }
      
      setResult({ ratio: r, risk, color });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}>Female</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Waist (cm)</label>
          <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hip (cm)</label>
          <input type="number" value={hip} onChange={(e) => setHip(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">Calculate Ratio</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-slate-900">{result.ratio}</p>
          <p className={`text-lg font-semibold ${result.color}`}>{result.risk}</p>
        </div>
      )}
    </div>
  );
};

const eGFRCalculator: React.FC = () => {
  const [creatinine, setCreatinine] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{ egfr: number; stage: string; color: string } | null>(null);

  const calculate = () => {
    const cr = parseFloat(creatinine);
    const a = parseInt(age);
    if (cr > 0 && a > 0) {
      let egfr = 175 * Math.pow(cr, -1.154) * Math.pow(a, -0.203);
      if (gender === 'female') egfr *= 0.742;
      
      const e = Math.round(egfr);
      let stage = '';
      let color = '';
      
      if (e >= 90) { stage = 'Normal/Stage 1'; color = 'text-green-500'; }
      else if (e >= 60) { stage = 'Stage 2 (Mild)'; color = 'text-yellow-500'; }
      else if (e >= 30) { stage = 'Stage 3 (Moderate)'; color = 'text-orange-500'; }
      else if (e >= 15) { stage = 'Stage 4 (Severe)'; color = 'text-red-500'; }
      else { stage = 'Stage 5 (Kidney Failure)'; color = 'text-red-600'; }
      
      setResult({ egfr: e, stage, color });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}>Female</button>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Serum Creatinine (mg/dL)</label>
        <input type="number" step="0.1" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g., 1.0" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Age (years)</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g., 50" />
      </div>
      <button onClick={calculate} className="w-full py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors">Calculate eGFR</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-slate-900">{result.egfr} mL/min</p>
          <p className={`text-lg font-semibold ${result.color}`}>{result.stage}</p>
        </div>
      )}
    </div>
  );
};

const MAPCalculator: React.FC = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [result, setResult] = useState<{ map: number; status: string; color: string } | null>(null);

  const calculate = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    if (sys > 0 && dia > 0) {
      const map = ((2 * dia) + sys) / 3;
      const m = Math.round(map);
      let status = '';
      let color = '';
      
      if (m < 70) { status = 'Low MAP'; color = 'text-yellow-500'; }
      else if (m <= 100) { status = 'Normal'; color = 'text-green-500'; }
      else { status = 'Elevated MAP'; color = 'text-yellow-500'; }
      
      setResult({ map: m, status, color });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Systolic (mmHg)</label>
          <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="120" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Diastolic (mmHg)</label>
          <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="80" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">Calculate MAP</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-slate-900">{result.map} mmHg</p>
          <p className={`text-lg font-semibold ${result.color}`}>{result.status}</p>
        </div>
      )}
    </div>
  );
};

const LipidCalculator: React.FC = () => {
  const [total, setTotal] = useState('');
  const [hdl, setHdl] = useState('');
  const [ldl, setLdl] = useState('');
  const [triglycerides, setTriglycerides] = useState('');
  const [result, setResult] = useState<{ ratio: number; risk: string; color: string; ldlStatus: string } | null>(null);

  const calculate = () => {
    const t = parseFloat(total);
    const h = parseFloat(hdl);
    const l = parseFloat(ldl);
    if (t > 0 && h > 0) {
      const ratio = t / h;
      const r = parseFloat(ratio.toFixed(1));
      
      let risk = '';
      let color = '';
      if (r < 3.5) { risk = 'Low Risk'; color = 'text-green-500'; }
      else if (r < 5) { risk = 'Moderate Risk'; color = 'text-yellow-500'; }
      else { risk = 'High Risk'; color = 'text-red-500'; }
      
      let ldlStatus = '';
      if (l < 100) ldlStatus = 'Optimal';
      else if (l < 130) ldlStatus = 'Near Optimal';
      else if (l < 160) ldlStatus = 'Borderline High';
      else if (l < 190) ldlStatus = 'High';
      else ldlStatus = 'Very High';
      
      setResult({ ratio: r, risk, color, ldlStatus });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Total Chol. (mg/dL)</label>
          <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">HDL (mg/dL)</label>
          <input type="number" value={hdl} onChange={(e) => setHdl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">LDL (mg/dL)</label>
          <input type="number" value={ldl} onChange={(e) => setLdl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Triglycerides (mg/dL)</label>
          <input type="number" value={triglycerides} onChange={(e) => setTriglycerides(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">Calculate Ratios</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Total/HDL Ratio:</span>
            <span className="font-bold">{result.ratio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Risk Level:</span>
            <span className={`font-semibold ${result.color}`}>{result.risk}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">LDL Status:</span>
            <span className="font-semibold">{result.ldlStatus}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const AnemiaRiskCalculator: React.FC = () => {
  const [fatigue, setFatigue] = useState(false);
  const [paleSkin, setPaleSkin] = useState(false);
  const [shortnessOfBreath, setShortnessOfBreath] = useState(false);
  const [dizziness, setDizziness] = useState(false);
  const [heavyPeriods, setHeavyPeriods] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [result, setResult] = useState<{ risk: string; color: string; score: number } | null>(null);

  const calculate = () => {
    let score = 0;
    if (fatigue) score += 2;
    if (paleSkin) score += 2;
    if (shortnessOfBreath) score += 2;
    if (dizziness) score += 1;
    if (heavyPeriods) score += 2;
    if (vegetarian) score += 1;
    
    let risk = '';
    let color = '';
    if (score <= 2) { risk = 'Low Risk'; color = 'text-green-500'; }
    else if (score <= 5) { risk = 'Moderate Risk'; color = 'text-yellow-500'; }
    else { risk = 'High Risk'; color = 'text-red-500'; }
    
    setResult({ risk, color, score });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 mb-3">Select symptoms and risk factors:</p>
      {[
        { label: 'Frequent fatigue', state: fatigue, setter: setFatigue },
        { label: 'Pale skin or nails', state: paleSkin, setter: setPaleSkin },
        { label: 'Shortness of breath', state: shortnessOfBreath, setter: setShortnessOfBreath },
        { label: 'Dizziness or lightheadedness', state: dizziness, setter: setDizziness },
        { label: 'Heavy menstrual periods', state: heavyPeriods, setter: setHeavyPeriods },
        { label: 'Vegetarian/Vegan diet', state: vegetarian, setter: setVegetarian },
      ].map((item) => (
        <label key={item.label} className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={item.state} onChange={(e) => item.setter(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm text-slate-700">{item.label}</span>
        </label>
      ))}
      <button onClick={calculate} className="w-full py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors mt-4">Assess Risk</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className={`text-2xl font-bold ${result.color}`}>{result.risk}</p>
          <p className="text-sm text-slate-500">Score: {result.score}/10</p>
        </div>
      )}
    </div>
  );
};

const ChildGrowthCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{ bmi: number; percentile: string } | null>(null);

  const calculate = () => {
    const a = parseInt(age);
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (a > 0 && h > 0 && w > 0) {
      const bmi = w / (h * h);
      const b = parseFloat(bmi.toFixed(1));
      setResult({ bmi: b, percentile: 'Consult pediatric chart for exact percentile' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Boy</button>
        <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}>Girl</button>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Age (months)</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g., 24" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors">Calculate BMI</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-slate-900">{result.bmi}</p>
          <p className="text-sm text-slate-500">BMI for age percentile</p>
          <p className="text-xs text-slate-400 mt-2">{result.percentile}</p>
        </div>
      )}
    </div>
  );
};

const VitaminDCalculator: React.FC = () => {
  const [sunExposure, setSunExposure] = useState('low');
  const [diet, setDiet] = useState(false);
  const [darkSkin, setDarkSkin] = useState(false);
  const [obese, setObese] = useState(false);
  const [result, setResult] = useState<{ risk: string; color: string; advice: string } | null>(null);

  const calculate = () => {
    let score = 0;
    if (sunExposure === 'low') score += 3;
    else if (sunExposure === 'moderate') score += 1;
    if (!diet) score += 2;
    if (darkSkin) score += 2;
    if (obese) score += 1;
    
    let risk = '';
    let color = '';
    let advice = '';
    if (score <= 2) { risk = 'Low Risk'; color = 'text-green-500'; advice = 'Maintain current lifestyle'; }
    else if (score <= 5) { risk = 'Moderate Risk'; color = 'text-yellow-500'; advice = 'Consider vitamin D testing'; }
    else { risk = 'High Risk'; color = 'text-red-500'; advice = 'Consult doctor for supplementation'; }
    
    setResult({ risk, color, advice });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Sun Exposure</label>
        <select value={sunExposure} onChange={(e) => setSunExposure(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white">
          <option value="low">Less than 15 min/day</option>
          <option value="moderate">15-30 min/day</option>
          <option value="high">More than 30 min/day</option>
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={diet} onChange={(e) => setDiet(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-slate-700">Regular vitamin D rich foods (fish, eggs, fortified foods)</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={darkSkin} onChange={(e) => setDarkSkin(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-slate-700">Darker skin tone</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={obese} onChange={(e) => setObese(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-slate-700">BMI {'>'} 30</span>
      </label>
      <button onClick={calculate} className="w-full py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors">Assess Risk</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className={`text-2xl font-bold ${result.color}`}>{result.risk}</p>
          <p className="text-sm text-slate-600 mt-2">{result.advice}</p>
        </div>
      )}
    </div>
  );
};

const FraminghamCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [totalChol, setTotalChol] = useState('');
  const [hdl, setHdl] = useState('');
  const [systolic, setSystolic] = useState('');
  const [smoker, setSmoker] = useState(false);
  const [result, setResult] = useState<{ risk: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const a = parseInt(age);
    const t = parseFloat(totalChol);
    const h = parseFloat(hdl);
    const s = parseInt(systolic);
    
    if (a > 0 && t > 0 && h > 0 && s > 0) {
      let score = 0;
      if (gender === 'male') {
        score = (a * 0.0455) + (t * 0.0215) - (h * 0.0289) + (s * 0.0195);
        if (smoker) score += 0.5689;
      } else {
        score = (a * 0.0329) + (t * 0.0175) - (h * 0.0255) + (s * 0.0162);
        if (smoker) score += 0.4329;
      }
      
      const riskPercent = Math.min(Math.round(score * 10), 30);
      let category = '';
      let color = '';
      if (riskPercent < 5) { category = 'Low Risk'; color = 'text-green-500'; }
      else if (riskPercent < 10) { category = 'Moderate Risk'; color = 'text-yellow-500'; }
      else if (riskPercent < 20) { category = 'High Risk'; color = 'text-orange-500'; }
      else { category = 'Very High Risk'; color = 'text-red-500'; }
      
      setResult({ risk: riskPercent, category, color });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}>Female</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Systolic BP</label>
          <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Total Chol.</label>
          <input type="number" value={totalChol} onChange={(e) => setTotalChol(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">HDL</label>
          <input type="number" value={hdl} onChange={(e) => setHdl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm text-slate-700">Current smoker</span>
      </label>
      <button onClick={calculate} className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">Calculate 10-Year Risk</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-slate-900">{result.risk}%</p>
          <p className={`text-lg font-semibold ${result.color}`}>{result.category}</p>
          <p className="text-xs text-slate-400 mt-2">10-year CVD risk estimate</p>
        </div>
      )}
    </div>
  );
};

const HbA1cCalculator: React.FC = () => {
  const [hba1c, setHba1c] = useState('');
  const [glucose, setGlucose] = useState('');
  const [mode, setMode] = useState<'toGlucose' | 'toHbA1c'>('toGlucose');
  const [result, setResult] = useState<{ value: number; unit: string; interpretation: string; color: string } | null>(null);

  const calculate = () => {
    if (mode === 'toGlucose') {
      const h = parseFloat(hba1c);
      if (h > 0) {
        const avgGlucose = (28.7 * h) - 46.7;
        let interpretation = '';
        let color = '';
        if (h < 5.7) { interpretation = 'Normal'; color = 'text-green-500'; }
        else if (h < 6.5) { interpretation = 'Prediabetes'; color = 'text-yellow-500'; }
        else { interpretation = 'Diabetes'; color = 'text-red-500'; }
        setResult({ value: Math.round(avgGlucose), unit: 'mg/dL', interpretation, color });
      }
    } else {
      const g = parseFloat(glucose);
      if (g > 0) {
        const estimatedHbA1c = (g + 46.7) / 28.7;
        let interpretation = '';
        let color = '';
        if (estimatedHbA1c < 5.7) { interpretation = 'Normal'; color = 'text-green-500'; }
        else if (estimatedHbA1c < 6.5) { interpretation = 'Prediabetes'; color = 'text-yellow-500'; }
        else { interpretation = 'Diabetes'; color = 'text-red-500'; }
        setResult({ value: parseFloat(estimatedHbA1c.toFixed(1)), unit: '%', interpretation, color });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('toGlucose')} className={`flex-1 py-2 rounded-lg font-medium text-xs ${mode === 'toGlucose' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>HbA1c → Glucose</button>
        <button onClick={() => setMode('toHbA1c')} className={`flex-1 py-2 rounded-lg font-medium text-xs ${mode === 'toHbA1c' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Glucose → HbA1c</button>
      </div>
      {mode === 'toGlucose' ? (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">HbA1c (%)</label>
          <input type="number" step="0.1" value={hba1c} onChange={(e) => setHba1c(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g., 6.5" />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Average Glucose (mg/dL)</label>
          <input type="number" value={glucose} onChange={(e) => setGlucose(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="e.g., 140" />
        </div>
      )}
      <button onClick={calculate} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">Convert</button>
      {result && (
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-slate-900">{result.value} {result.unit}</p>
          <p className={`text-lg font-semibold ${result.color}`}>{result.interpretation}</p>
        </div>
      )}
    </div>
  );
};

const calculatorComponents: Record<string, React.FC> = {
  bmi: BMICalculator,
  bmr: BMRCalculator,
  calories: CaloriesCalculator,
  duedate: DueDateCalculator,
  ovulation: OvulationCalculator,
  bloodpressure: BloodPressureCalculator,
  diabetes: DiabetesRiskCalculator,
  heartrate: HeartRateCalculator,
  bodyfat: BodyFatCalculator,
  waisthip: WaistHipCalculator,
  egfr: eGFRCalculator,
  map: MAPCalculator,
  lipid: LipidCalculator,
  anemia: AnemiaRiskCalculator,
  growth: ChildGrowthCalculator,
  vitamind: VitaminDCalculator,
  framingham: FraminghamCalculator,
  hba1c: HbA1cCalculator,
};

const Tools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredTools = filter === 'all' ? tools : tools.filter(t => t.category === filter);

  const CalculatorComponent = selectedTool ? calculatorComponents[selectedTool.id] : null;

  if (selectedTool && CalculatorComponent) {
    const colors = categoryColors[selectedTool.category];
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <button onClick={() => setSelectedTool(null)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to all calculators</span>
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className={`p-8 ${colors.bg} border-b ${colors.border}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                  {selectedTool.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{selectedTool.name}</h1>
                  <p className="text-slate-600">{selectedTool.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <CalculatorComponent />
              
              <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-slate-400 mt-0.5" />
                  <p className="text-xs text-slate-500">
                    This calculator provides estimates for informational purposes only. Always consult with a healthcare professional for medical advice, diagnosis, or treatment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6">
              <Calculator size={16} />
              <span>18 Available Tools</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Medical Calculators & Health Tools
            </h1>
            <p className="text-lg text-slate-600">
              Accurate health calculators to help you track, assess, and understand your health metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Tools', count: tools.length },
            { id: 'fitness', label: 'Fitness', count: tools.filter(t => t.category === 'fitness').length },
            { id: 'pregnancy', label: 'Pregnancy', count: tools.filter(t => t.category === 'pregnancy').length },
            { id: 'heart', label: 'Heart', count: tools.filter(t => t.category === 'heart').length },
            { id: 'diabetes', label: 'Diabetes', count: tools.filter(t => t.category === 'diabetes').length },
            { id: 'general', label: 'General', count: tools.filter(t => t.category === 'general').length },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured: Medical Dictionary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            onClick={() => window.location.href = '/dictionary'}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <span className="px-2 py-1 bg-white/20 text-slate-900 text-xs font-semibold rounded-full">
                  ★ Featured
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">Medical Dictionary</h3>
              <p className="text-slate-700 text-sm mb-4">A-Z reference with definitions, etymology, pronunciation & clinical usage</p>
              <div className="flex items-center text-slate-900 text-sm font-medium">
                <span>Browse Dictionary</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {filteredTools.map((tool, index) => {
            const colors = categoryColors[tool.category];
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTool(tool)}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {tool.icon}
                  </div>
                  <div className="flex gap-1">
                    {tool.popular && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                        ★ Popular
                      </span>
                    )}
                    <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full capitalize`}>
                      {tool.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{tool.description}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Use Calculator</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No tools found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
