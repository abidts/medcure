import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Activity, Baby, Heart, Flame, Droplets, Gauge, Percent, Ruler, Clock, Droplet, TrendingUp, Circle, ChevronRight, ArrowLeft, Baby as BabyIcon, Sun, Activity as ActivityIcon, Info, BookOpen } from 'lucide-react';
const tools = [
    { id: 'bmi', name: 'BMI Calculator', description: 'Calculate your Body Mass Index to assess weight status', icon: _jsx(Calculator, { size: 24 }), category: 'fitness', popular: true },
    { id: 'bmr', name: 'BMR Calculator', description: 'Calculate your Basal Metabolic Rate for daily calorie needs', icon: _jsx(Flame, { size: 24 }), category: 'fitness', popular: true },
    { id: 'calories', name: 'Calories Calculator', description: 'Estimate daily caloric requirements based on activity level', icon: _jsx(Activity, { size: 24 }), category: 'fitness' },
    { id: 'duedate', name: 'Due Date Calculator', description: 'Calculate estimated delivery date for pregnancy', icon: _jsx(Baby, { size: 24 }), category: 'pregnancy', popular: true },
    { id: 'ovulation', name: 'Ovulation Calculator', description: 'Track your fertile window and ovulation period', icon: _jsx(Clock, { size: 24 }), category: 'pregnancy' },
    { id: 'bloodpressure', name: 'Blood Pressure Calculator', description: 'Assess blood pressure readings and cardiovascular risk', icon: _jsx(Gauge, { size: 24 }), category: 'heart' },
    { id: 'diabetes', name: 'Diabetes Risk Calculator', description: 'Evaluate your risk factors for developing diabetes', icon: _jsx(Droplet, { size: 24 }), category: 'diabetes' },
    { id: 'heartrate', name: 'Heart Rate Calculator', description: 'Calculate target heart rate zones for optimal exercise', icon: _jsx(Heart, { size: 24 }), category: 'heart' },
    { id: 'bodyfat', name: 'Body Fat Calculator', description: 'Estimate body fat percentage using various methods', icon: _jsx(Percent, { size: 24 }), category: 'fitness' },
    { id: 'waisthip', name: 'Waist-Hip Ratio Calculator', description: 'Calculate waist-to-hip ratio for health assessment', icon: _jsx(Ruler, { size: 24 }), category: 'fitness' },
    { id: 'egfr', name: 'eGFR Calculator', description: 'Estimate glomerular filtration rate for kidney function', icon: _jsx(ActivityIcon, { size: 24 }), category: 'general' },
    { id: 'map', name: 'MAP Calculator', description: 'Calculate Mean Arterial Pressure for cardiovascular health', icon: _jsx(TrendingUp, { size: 24 }), category: 'heart' },
    { id: 'lipid', name: 'Lipid Profile Calculator', description: 'Calculate cholesterol ratios and cardiovascular risk', icon: _jsx(Droplets, { size: 24 }), category: 'heart' },
    { id: 'anemia', name: 'Anemia Risk Calculator', description: 'Assess risk factors and symptoms of anemia', icon: _jsx(Circle, { size: 24 }), category: 'general' },
    { id: 'growth', name: 'Child Growth Calculator', description: 'Track child development with growth percentiles', icon: _jsx(BabyIcon, { size: 24 }), category: 'general' },
    { id: 'vitamind', name: 'Vitamin D Risk Calculator', description: 'Assess vitamin D deficiency risk factors', icon: _jsx(Sun, { size: 24 }), category: 'general' },
    { id: 'framingham', name: 'Framingham Risk Calculator', description: 'Calculate 10-year cardiovascular disease risk', icon: _jsx(Heart, { size: 24 }), category: 'heart' },
    { id: 'hba1c', name: 'HbA1c Calculator', description: 'Convert between HbA1c values and average glucose', icon: _jsx(Droplet, { size: 24 }), category: 'diabetes' },
];
const categoryColors = {
    fitness: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    pregnancy: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    heart: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    diabetes: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    general: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
};
// Calculator Components
const BMICalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);
    const calculate = () => {
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        if (h > 0 && w > 0) {
            const bmi = w / (h * h);
            let category = '';
            let color = '';
            if (bmi < 18.5) {
                category = 'Underweight';
                color = 'text-blue-500';
            }
            else if (bmi < 25) {
                category = 'Normal weight';
                color = 'text-green-500';
            }
            else if (bmi < 30) {
                category = 'Overweight';
                color = 'text-yellow-500';
            }
            else {
                category = 'Obese';
                color = 'text-red-500';
            }
            setResult({ bmi: parseFloat(bmi.toFixed(1)), category, color });
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Height (cm)" }), _jsx("input", { type: "number", value: height, onChange: (e) => setHeight(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none", placeholder: "e.g., 170" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Weight (kg)" }), _jsx("input", { type: "number", value: weight, onChange: (e) => setWeight(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none", placeholder: "e.g., 70" })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors", children: "Calculate BMI" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: "text-3xl font-bold text-slate-900", children: result.bmi }), _jsx("p", { className: `text-lg font-semibold ${result.color}`, children: result.category }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "BMI is a screening indicator of weight-related health risk. It does not directly measure body fat and may be less accurate for athletes, elderly adults, and during pregnancy. Use this value with waist circumference, activity level, and medical history for a complete assessment." })] }))] }));
};
const BMRCalculator = () => {
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);
    const calculate = () => {
        const a = parseFloat(age);
        const h = parseFloat(height);
        const w = parseFloat(weight);
        if (a > 0 && h > 0 && w > 0) {
            let bmr = 0;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
            }
            else {
                bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
            }
            setResult(Math.round(bmr));
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGender('male'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`, children: "Male" }), _jsx("button", { onClick: () => setGender('female'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600'}`, children: "Female" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Age (years)" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none", placeholder: "e.g., 30" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Height (cm)" }), _jsx("input", { type: "number", value: height, onChange: (e) => setHeight(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none", placeholder: "e.g., 170" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Weight (kg)" }), _jsx("input", { type: "number", value: weight, onChange: (e) => setWeight(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none", placeholder: "e.g., 70" })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors", children: "Calculate BMR" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: "text-sm text-slate-500", children: "Daily calorie needs at rest" }), _jsxs("p", { className: "text-3xl font-bold text-slate-900", children: [result, " kcal/day"] }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "This is the estimated energy your body needs for essential functions at complete rest (breathing, circulation, temperature control). For weight loss or gain planning, combine this with activity calories and monitor changes over 2-4 weeks." })] }))] }));
};
const CaloriesCalculator = () => {
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState('1.2');
    const [result, setResult] = useState(null);
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
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGender('male'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`, children: "Male" }), _jsx("button", { onClick: () => setGender('female'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600'}`, children: "Female" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Age" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none", placeholder: "30" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Height (cm)" }), _jsx("input", { type: "number", value: height, onChange: (e) => setHeight(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none", placeholder: "170" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Weight (kg)" }), _jsx("input", { type: "number", value: weight, onChange: (e) => setWeight(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none", placeholder: "70" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Activity Level" }), _jsx("select", { value: activity, onChange: (e) => setActivity(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white", children: activityLevels.map(l => _jsx("option", { value: l.value, children: l.label }, l.value)) })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors", children: "Calculate Calories" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: "text-sm text-slate-500", children: "Daily calorie needs" }), _jsxs("p", { className: "text-3xl font-bold text-slate-900", children: [result, " kcal/day"] }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "This estimate reflects maintenance calories based on your reported activity level. For fat loss, consider a modest deficit (about 300-500 kcal/day). For muscle gain, use a small surplus and prioritize protein and strength training." })] }))] }));
};
const DueDateCalculator = () => {
    const [lmp, setLmp] = useState('');
    const [result, setResult] = useState(null);
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
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "First Day of Last Menstrual Period (LMP)" }), _jsx("input", { type: "date", value: lmp, onChange: (e) => setLmp(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors", children: "Calculate Due Date" }), result && (_jsxs("div", { className: "p-4 bg-pink-50 rounded-xl text-center", children: [_jsx("p", { className: "text-sm text-pink-600", children: "Estimated Due Date" }), _jsx("p", { className: "text-2xl font-bold text-slate-900", children: result.dueDate }), _jsxs("p", { className: "text-sm text-slate-500 mt-2", children: ["Currently ~", result.weeks, " weeks pregnant"] }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "This uses Naegele's rule (LMP + 280 days) and assumes a regular 28-day cycle. Early ultrasound dating can be more precise, especially with irregular cycles or uncertain LMP." })] }))] }));
};
const OvulationCalculator = () => {
    const [lmp, setLmp] = useState('');
    const [cycleLength, setCycleLength] = useState('28');
    const [result, setResult] = useState(null);
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
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "First Day of Last Period" }), _jsx("input", { type: "date", value: lmp, onChange: (e) => setLmp(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Average Cycle Length (days)" }), _jsx("input", { type: "number", value: cycleLength, onChange: (e) => setCycleLength(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors", children: "Calculate" }), result && (_jsxs("div", { className: "p-4 bg-pink-50 rounded-xl space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Ovulation Date:" }), _jsx("span", { className: "font-semibold text-pink-600", children: result.ovulation })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Fertile Window:" }), _jsxs("span", { className: "font-semibold", children: [result.fertileStart, " - ", result.fertileEnd] })] }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "This is an estimate based on average cycle timing. Ovulation can vary month to month. For better accuracy, combine with ovulation kits, cervical mucus tracking, or basal body temperature." })] }))] }));
};
const BloodPressureCalculator = () => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [result, setResult] = useState(null);
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
            }
            else if (sys < 120 && dia < 80) {
                category = 'Normal';
                color = 'text-green-500';
                advice = 'Keep maintaining a healthy lifestyle.';
            }
            else if (sys < 130 && dia < 80) {
                category = 'Elevated';
                color = 'text-yellow-500';
                advice = 'Consider lifestyle changes to prevent hypertension.';
            }
            else if (sys < 140 || dia < 90) {
                category = 'Stage 1 Hypertension';
                color = 'text-orange-500';
                advice = 'Consult your healthcare provider for management.';
            }
            else {
                category = 'Stage 2 Hypertension';
                color = 'text-red-500';
                advice = 'Seek medical attention for proper treatment.';
            }
            setResult({ category, color, advice });
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Systolic (mmHg)" }), _jsx("input", { type: "number", value: systolic, onChange: (e) => setSystolic(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none", placeholder: "120" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Diastolic (mmHg)" }), _jsx("input", { type: "number", value: diastolic, onChange: (e) => setDiastolic(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none", placeholder: "80" })] })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors", children: "Assess Blood Pressure" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: `text-xl font-bold ${result.color}`, children: result.category }), _jsx("p", { className: "text-sm text-slate-600 mt-2", children: result.advice }), _jsx("p", { className: "text-xs text-slate-500 mt-3 leading-relaxed", children: "Single readings can be misleading. Measure blood pressure after 5 minutes rest, avoid caffeine/smoking beforehand, and track multiple readings across several days." })] }))] }));
};
const DiabetesRiskCalculator = () => {
    const [age, setAge] = useState('');
    const [bmi, setBmi] = useState('');
    const [familyHistory, setFamilyHistory] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [result, setResult] = useState(null);
    const calculate = () => {
        let score = 0;
        const ageNum = parseInt(age);
        const bmiNum = parseFloat(bmi);
        if (ageNum >= 45)
            score += 2;
        else if (ageNum >= 35)
            score += 1;
        if (bmiNum >= 30)
            score += 2;
        else if (bmiNum >= 25)
            score += 1;
        if (familyHistory)
            score += 2;
        if (inactive)
            score += 1;
        let risk = '';
        let color = '';
        if (score <= 2) {
            risk = 'Low Risk';
            color = 'text-green-500';
        }
        else if (score <= 5) {
            risk = 'Moderate Risk';
            color = 'text-yellow-500';
        }
        else {
            risk = 'High Risk';
            color = 'text-red-500';
        }
        setResult({ risk, color, score });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Age" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "e.g., 45" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "BMI" }), _jsx("input", { type: "number", value: bmi, onChange: (e) => setBmi(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "e.g., 28" })] })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: familyHistory, onChange: (e) => setFamilyHistory(e.target.checked), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-slate-700", children: "Family history of diabetes" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: inactive, onChange: (e) => setInactive(e.target.checked), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-slate-700", children: "Physically inactive" })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors", children: "Calculate Risk" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: `text-2xl font-bold ${result.color}`, children: result.risk }), _jsxs("p", { className: "text-sm text-slate-500", children: ["Risk Score: ", result.score, "/7"] }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "This score is a screening estimate, not a diagnosis. Confirm risk with fasting glucose, HbA1c, and clinical assessment. Early diet, exercise, sleep, and weight control can significantly reduce future diabetes risk." })] }))] }));
};
const HeartRateCalculator = () => {
    const [age, setAge] = useState('');
    const [result, setResult] = useState(null);
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
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Age (years)" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "e.g., 30" })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors", children: "Calculate Heart Rate Zones" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Maximum Heart Rate:" }), _jsxs("span", { className: "font-bold", children: [result.max, " bpm"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Target Zone:" }), _jsxs("span", { className: "font-bold text-red-600", children: [result.targetMin, " - ", result.targetMax, " bpm"] })] }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "Use lower zones for recovery and endurance base; higher zones for interval and performance training. If you have cardiac symptoms or known heart disease, use medically supervised targets." })] }))] }));
};
const BodyFatCalculator = () => {
    const [gender, setGender] = useState('male');
    const [waist, setWaist] = useState('');
    const [neck, setNeck] = useState('');
    const [hip, setHip] = useState('');
    const [height, setHeight] = useState('');
    const [result, setResult] = useState(null);
    const calculate = () => {
        const w = parseFloat(waist);
        const n = parseFloat(neck);
        const h = parseFloat(height);
        const hp = parseFloat(hip);
        if (w > 0 && n > 0 && h > 0) {
            let bodyFat = 0;
            if (gender === 'male') {
                bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
            }
            else {
                if (hp > 0) {
                    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
                }
            }
            const bf = parseFloat(bodyFat.toFixed(1));
            let category = '';
            let color = '';
            if (gender === 'male') {
                if (bf < 6) {
                    category = 'Essential Fat';
                    color = 'text-blue-500';
                }
                else if (bf < 14) {
                    category = 'Athletes';
                    color = 'text-green-500';
                }
                else if (bf < 18) {
                    category = 'Fitness';
                    color = 'text-emerald-500';
                }
                else if (bf < 25) {
                    category = 'Average';
                    color = 'text-yellow-500';
                }
                else {
                    category = 'Obese';
                    color = 'text-red-500';
                }
            }
            else {
                if (bf < 14) {
                    category = 'Essential Fat';
                    color = 'text-blue-500';
                }
                else if (bf < 21) {
                    category = 'Athletes';
                    color = 'text-green-500';
                }
                else if (bf < 25) {
                    category = 'Fitness';
                    color = 'text-emerald-500';
                }
                else if (bf < 32) {
                    category = 'Average';
                    color = 'text-yellow-500';
                }
                else {
                    category = 'Obese';
                    color = 'text-red-500';
                }
            }
            setResult({ bodyFat: bf, category, color });
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGender('male'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`, children: "Male" }), _jsx("button", { onClick: () => setGender('female'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`, children: "Female" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Waist (cm)" }), _jsx("input", { type: "number", value: waist, onChange: (e) => setWaist(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Neck (cm)" }), _jsx("input", { type: "number", value: neck, onChange: (e) => setNeck(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] }), gender === 'female' && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Hip (cm)" }), _jsx("input", { type: "number", value: hip, onChange: (e) => setHip(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Height (cm)" }), _jsx("input", { type: "number", value: height, onChange: (e) => setHeight(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors", children: "Calculate Body Fat" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsxs("p", { className: "text-3xl font-bold text-slate-900", children: [result.bodyFat, "%"] }), _jsx("p", { className: `text-lg font-semibold ${result.color}`, children: result.category }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "Body-fat estimates vary by hydration, measurement technique, and body type. Track trends over time rather than one-off values, and combine with strength, waist, and fitness metrics." })] }))] }));
};
const WaistHipCalculator = () => {
    const [waist, setWaist] = useState('');
    const [hip, setHip] = useState('');
    const [gender, setGender] = useState('male');
    const [result, setResult] = useState(null);
    const calculate = () => {
        const w = parseFloat(waist);
        const h = parseFloat(hip);
        if (w > 0 && h > 0) {
            const ratio = w / h;
            const r = parseFloat(ratio.toFixed(2));
            let risk = '';
            let color = '';
            if (gender === 'male') {
                if (r < 0.9) {
                    risk = 'Low Risk';
                    color = 'text-green-500';
                }
                else if (r < 0.95) {
                    risk = 'Moderate Risk';
                    color = 'text-yellow-500';
                }
                else {
                    risk = 'High Risk';
                    color = 'text-red-500';
                }
            }
            else {
                if (r < 0.8) {
                    risk = 'Low Risk';
                    color = 'text-green-500';
                }
                else if (r < 0.85) {
                    risk = 'Moderate Risk';
                    color = 'text-yellow-500';
                }
                else {
                    risk = 'High Risk';
                    color = 'text-red-500';
                }
            }
            setResult({ ratio: r, risk, color });
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGender('male'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`, children: "Male" }), _jsx("button", { onClick: () => setGender('female'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`, children: "Female" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Waist (cm)" }), _jsx("input", { type: "number", value: waist, onChange: (e) => setWaist(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Hip (cm)" }), _jsx("input", { type: "number", value: hip, onChange: (e) => setHip(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" })] })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors", children: "Calculate Ratio" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: "text-3xl font-bold text-slate-900", children: result.ratio }), _jsx("p", { className: `text-lg font-semibold ${result.color}`, children: result.risk }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "Waist-hip ratio helps assess central fat distribution, which is linked to metabolic and cardiovascular risk. Consider this together with BMI, lipid profile, and blood sugar for better risk interpretation." })] }))] }));
};
const eGFRCalculator = () => {
    const [creatinine, setCreatinine] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [result, setResult] = useState(null);
    const calculate = () => {
        const cr = parseFloat(creatinine);
        const a = parseInt(age);
        if (cr > 0 && a > 0) {
            let egfr = 175 * Math.pow(cr, -1.154) * Math.pow(a, -0.203);
            if (gender === 'female')
                egfr *= 0.742;
            const e = Math.round(egfr);
            let stage = '';
            let color = '';
            if (e >= 90) {
                stage = 'Normal/Stage 1';
                color = 'text-green-500';
            }
            else if (e >= 60) {
                stage = 'Stage 2 (Mild)';
                color = 'text-yellow-500';
            }
            else if (e >= 30) {
                stage = 'Stage 3 (Moderate)';
                color = 'text-orange-500';
            }
            else if (e >= 15) {
                stage = 'Stage 4 (Severe)';
                color = 'text-red-500';
            }
            else {
                stage = 'Stage 5 (Kidney Failure)';
                color = 'text-red-600';
            }
            setResult({ egfr: e, stage, color });
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGender('male'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`, children: "Male" }), _jsx("button", { onClick: () => setGender('female'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`, children: "Female" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Serum Creatinine (mg/dL)" }), _jsx("input", { type: "number", step: "0.1", value: creatinine, onChange: (e) => setCreatinine(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "e.g., 1.0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Age (years)" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "e.g., 50" })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors", children: "Calculate eGFR" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsxs("p", { className: "text-3xl font-bold text-slate-900", children: [result.egfr, " mL/min"] }), _jsx("p", { className: `text-lg font-semibold ${result.color}`, children: result.stage }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "eGFR is an estimate and should be interpreted with urine albumin, trend over time, age, and comorbidities. Persistent reduction for 3+ months may indicate chronic kidney disease and needs medical follow-up." })] }))] }));
};
const MAPCalculator = () => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [result, setResult] = useState(null);
    const calculate = () => {
        const sys = parseInt(systolic);
        const dia = parseInt(diastolic);
        if (sys > 0 && dia > 0) {
            const map = ((2 * dia) + sys) / 3;
            const m = Math.round(map);
            let status = '';
            let color = '';
            if (m < 70) {
                status = 'Low MAP';
                color = 'text-yellow-500';
            }
            else if (m <= 100) {
                status = 'Normal';
                color = 'text-green-500';
            }
            else {
                status = 'Elevated MAP';
                color = 'text-yellow-500';
            }
            setResult({ map: m, status, color });
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Systolic (mmHg)" }), _jsx("input", { type: "number", value: systolic, onChange: (e) => setSystolic(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "120" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Diastolic (mmHg)" }), _jsx("input", { type: "number", value: diastolic, onChange: (e) => setDiastolic(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "80" })] })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors", children: "Calculate MAP" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsxs("p", { className: "text-3xl font-bold text-slate-900", children: [result.map, " mmHg"] }), _jsx("p", { className: `text-lg font-semibold ${result.color}`, children: result.status }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "MAP reflects average arterial pressure and organ perfusion. Very low values can compromise blood flow; persistently high values can indicate vascular strain. Interpret with symptoms and clinical context." })] }))] }));
};
const LipidCalculator = () => {
    const [total, setTotal] = useState('');
    const [hdl, setHdl] = useState('');
    const [ldl, setLdl] = useState('');
    const [triglycerides, setTriglycerides] = useState('');
    const [result, setResult] = useState(null);
    const calculate = () => {
        const t = parseFloat(total);
        const h = parseFloat(hdl);
        const l = parseFloat(ldl);
        if (t > 0 && h > 0) {
            const ratio = t / h;
            const r = parseFloat(ratio.toFixed(1));
            let risk = '';
            let color = '';
            if (r < 3.5) {
                risk = 'Low Risk';
                color = 'text-green-500';
            }
            else if (r < 5) {
                risk = 'Moderate Risk';
                color = 'text-yellow-500';
            }
            else {
                risk = 'High Risk';
                color = 'text-red-500';
            }
            let ldlStatus = '';
            if (l < 100)
                ldlStatus = 'Optimal';
            else if (l < 130)
                ldlStatus = 'Near Optimal';
            else if (l < 160)
                ldlStatus = 'Borderline High';
            else if (l < 190)
                ldlStatus = 'High';
            else
                ldlStatus = 'Very High';
            setResult({ ratio: r, risk, color, ldlStatus });
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Total Chol. (mg/dL)" }), _jsx("input", { type: "number", value: total, onChange: (e) => setTotal(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "HDL (mg/dL)" }), _jsx("input", { type: "number", value: hdl, onChange: (e) => setHdl(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "LDL (mg/dL)" }), _jsx("input", { type: "number", value: ldl, onChange: (e) => setLdl(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Triglycerides (mg/dL)" }), _jsx("input", { type: "number", value: triglycerides, onChange: (e) => setTriglycerides(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors", children: "Calculate Ratios" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Total/HDL Ratio:" }), _jsx("span", { className: "font-bold", children: result.ratio })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Risk Level:" }), _jsx("span", { className: `font-semibold ${result.color}`, children: result.risk })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-slate-600", children: "LDL Status:" }), _jsx("span", { className: "font-semibold", children: result.ldlStatus })] }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "Cardiovascular risk depends on full profile (LDL, HDL, triglycerides), blood pressure, smoking, diabetes, and family history. Use these ratios as guidance and discuss treatment targets with your clinician." })] }))] }));
};
const AnemiaRiskCalculator = () => {
    const [fatigue, setFatigue] = useState(false);
    const [paleSkin, setPaleSkin] = useState(false);
    const [shortnessOfBreath, setShortnessOfBreath] = useState(false);
    const [dizziness, setDizziness] = useState(false);
    const [heavyPeriods, setHeavyPeriods] = useState(false);
    const [vegetarian, setVegetarian] = useState(false);
    const [result, setResult] = useState(null);
    const calculate = () => {
        let score = 0;
        if (fatigue)
            score += 2;
        if (paleSkin)
            score += 2;
        if (shortnessOfBreath)
            score += 2;
        if (dizziness)
            score += 1;
        if (heavyPeriods)
            score += 2;
        if (vegetarian)
            score += 1;
        let risk = '';
        let color = '';
        if (score <= 2) {
            risk = 'Low Risk';
            color = 'text-green-500';
        }
        else if (score <= 5) {
            risk = 'Moderate Risk';
            color = 'text-yellow-500';
        }
        else {
            risk = 'High Risk';
            color = 'text-red-500';
        }
        setResult({ risk, color, score });
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm text-slate-500 mb-3", children: "Select symptoms and risk factors:" }), [
                { label: 'Frequent fatigue', state: fatigue, setter: setFatigue },
                { label: 'Pale skin or nails', state: paleSkin, setter: setPaleSkin },
                { label: 'Shortness of breath', state: shortnessOfBreath, setter: setShortnessOfBreath },
                { label: 'Dizziness or lightheadedness', state: dizziness, setter: setDizziness },
                { label: 'Heavy menstrual periods', state: heavyPeriods, setter: setHeavyPeriods },
                { label: 'Vegetarian/Vegan diet', state: vegetarian, setter: setVegetarian },
            ].map((item) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: item.state, onChange: (e) => item.setter(e.target.checked), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-slate-700", children: item.label })] }, item.label))), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors mt-4", children: "Assess Risk" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: `text-2xl font-bold ${result.color}`, children: result.risk }), _jsxs("p", { className: "text-sm text-slate-500", children: ["Score: ", result.score, "/10"] }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "This symptom checklist estimates likelihood only. Confirm anemia with CBC, hemoglobin, ferritin, and iron studies. If symptoms are persistent, seek evaluation even with moderate scores." })] }))] }));
};
const ChildGrowthCalculator = () => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('male');
    const [result, setResult] = useState(null);
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
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGender('male'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`, children: "Boy" }), _jsx("button", { onClick: () => setGender('female'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`, children: "Girl" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Age (months)" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "e.g., 24" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Height (cm)" }), _jsx("input", { type: "number", value: height, onChange: (e) => setHeight(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Weight (kg)" }), _jsx("input", { type: "number", value: weight, onChange: (e) => setWeight(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" })] })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors", children: "Calculate BMI" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: "text-3xl font-bold text-slate-900", children: result.bmi }), _jsx("p", { className: "text-sm text-slate-500", children: "BMI for age percentile" }), _jsx("p", { className: "text-xs text-slate-400 mt-2", children: result.percentile }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "Child growth interpretation should use age- and sex-specific percentile charts (WHO/CDC) and growth velocity trends. A pediatric clinician should review serial measurements for accurate assessment." })] }))] }));
};
const VitaminDCalculator = () => {
    const [sunExposure, setSunExposure] = useState('low');
    const [diet, setDiet] = useState(false);
    const [darkSkin, setDarkSkin] = useState(false);
    const [obese, setObese] = useState(false);
    const [result, setResult] = useState(null);
    const calculate = () => {
        let score = 0;
        if (sunExposure === 'low')
            score += 3;
        else if (sunExposure === 'moderate')
            score += 1;
        if (!diet)
            score += 2;
        if (darkSkin)
            score += 2;
        if (obese)
            score += 1;
        let risk = '';
        let color = '';
        let advice = '';
        if (score <= 2) {
            risk = 'Low Risk';
            color = 'text-green-500';
            advice = 'Maintain current lifestyle';
        }
        else if (score <= 5) {
            risk = 'Moderate Risk';
            color = 'text-yellow-500';
            advice = 'Consider vitamin D testing';
        }
        else {
            risk = 'High Risk';
            color = 'text-red-500';
            advice = 'Consult doctor for supplementation';
        }
        setResult({ risk, color, advice });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Sun Exposure" }), _jsxs("select", { value: sunExposure, onChange: (e) => setSunExposure(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white", children: [_jsx("option", { value: "low", children: "Less than 15 min/day" }), _jsx("option", { value: "moderate", children: "15-30 min/day" }), _jsx("option", { value: "high", children: "More than 30 min/day" })] })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: diet, onChange: (e) => setDiet(e.target.checked), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-slate-700", children: "Regular vitamin D rich foods (fish, eggs, fortified foods)" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: darkSkin, onChange: (e) => setDarkSkin(e.target.checked), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-slate-700", children: "Darker skin tone" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: obese, onChange: (e) => setObese(e.target.checked), className: "w-4 h-4" }), _jsxs("span", { className: "text-sm text-slate-700", children: ["BMI ", '>', " 30"] })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors", children: "Assess Risk" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsx("p", { className: `text-2xl font-bold ${result.color}`, children: result.risk }), _jsx("p", { className: "text-sm text-slate-600 mt-2", children: result.advice }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "Risk can increase with indoor lifestyle, limited sun exposure, malabsorption, or obesity. Confirmation requires a serum 25(OH)D blood test before long-term supplementation plans." })] }))] }));
};
const FraminghamCalculator = () => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [totalChol, setTotalChol] = useState('');
    const [hdl, setHdl] = useState('');
    const [systolic, setSystolic] = useState('');
    const [smoker, setSmoker] = useState(false);
    const [result, setResult] = useState(null);
    const calculate = () => {
        const a = parseInt(age);
        const t = parseFloat(totalChol);
        const h = parseFloat(hdl);
        const s = parseInt(systolic);
        if (a > 0 && t > 0 && h > 0 && s > 0) {
            let score = 0;
            if (gender === 'male') {
                score = (a * 0.0455) + (t * 0.0215) - (h * 0.0289) + (s * 0.0195);
                if (smoker)
                    score += 0.5689;
            }
            else {
                score = (a * 0.0329) + (t * 0.0175) - (h * 0.0255) + (s * 0.0162);
                if (smoker)
                    score += 0.4329;
            }
            const riskPercent = Math.min(Math.round(score * 10), 30);
            let category = '';
            let color = '';
            if (riskPercent < 5) {
                category = 'Low Risk';
                color = 'text-green-500';
            }
            else if (riskPercent < 10) {
                category = 'Moderate Risk';
                color = 'text-yellow-500';
            }
            else if (riskPercent < 20) {
                category = 'High Risk';
                color = 'text-orange-500';
            }
            else {
                category = 'Very High Risk';
                color = 'text-red-500';
            }
            setResult({ risk: riskPercent, category, color });
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGender('male'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`, children: "Male" }), _jsx("button", { onClick: () => setGender('female'), className: `flex-1 py-2 rounded-lg font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`, children: "Female" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Age" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Systolic BP" }), _jsx("input", { type: "number", value: systolic, onChange: (e) => setSystolic(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Total Chol." }), _jsx("input", { type: "number", value: totalChol, onChange: (e) => setTotalChol(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "HDL" }), _jsx("input", { type: "number", value: hdl, onChange: (e) => setHdl(e.target.value), className: "w-full px-3 py-2 rounded-lg border border-slate-200 outline-none" })] })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: smoker, onChange: (e) => setSmoker(e.target.checked), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-slate-700", children: "Current smoker" })] }), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors", children: "Calculate 10-Year Risk" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsxs("p", { className: "text-3xl font-bold text-slate-900", children: [result.risk, "%"] }), _jsx("p", { className: `text-lg font-semibold ${result.color}`, children: result.category }), _jsx("p", { className: "text-xs text-slate-400 mt-2", children: "10-year CVD risk estimate" }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "Framingham risk is population-based and may under- or over-estimate in some groups. Use with clinician review, especially when considering statins, BP control, and smoking cessation interventions." })] }))] }));
};
const HbA1cCalculator = () => {
    const [hba1c, setHba1c] = useState('');
    const [glucose, setGlucose] = useState('');
    const [mode, setMode] = useState('toGlucose');
    const [result, setResult] = useState(null);
    const calculate = () => {
        if (mode === 'toGlucose') {
            const h = parseFloat(hba1c);
            if (h > 0) {
                const avgGlucose = (28.7 * h) - 46.7;
                let interpretation = '';
                let color = '';
                if (h < 5.7) {
                    interpretation = 'Normal';
                    color = 'text-green-500';
                }
                else if (h < 6.5) {
                    interpretation = 'Prediabetes';
                    color = 'text-yellow-500';
                }
                else {
                    interpretation = 'Diabetes';
                    color = 'text-red-500';
                }
                setResult({ value: Math.round(avgGlucose), unit: 'mg/dL', interpretation, color });
            }
        }
        else {
            const g = parseFloat(glucose);
            if (g > 0) {
                const estimatedHbA1c = (g + 46.7) / 28.7;
                let interpretation = '';
                let color = '';
                if (estimatedHbA1c < 5.7) {
                    interpretation = 'Normal';
                    color = 'text-green-500';
                }
                else if (estimatedHbA1c < 6.5) {
                    interpretation = 'Prediabetes';
                    color = 'text-yellow-500';
                }
                else {
                    interpretation = 'Diabetes';
                    color = 'text-red-500';
                }
                setResult({ value: parseFloat(estimatedHbA1c.toFixed(1)), unit: '%', interpretation, color });
            }
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setMode('toGlucose'), className: `flex-1 py-2 rounded-lg font-medium text-xs ${mode === 'toGlucose' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`, children: "HbA1c \u2192 Glucose" }), _jsx("button", { onClick: () => setMode('toHbA1c'), className: `flex-1 py-2 rounded-lg font-medium text-xs ${mode === 'toHbA1c' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`, children: "Glucose \u2192 HbA1c" })] }), mode === 'toGlucose' ? (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "HbA1c (%)" }), _jsx("input", { type: "number", step: "0.1", value: hba1c, onChange: (e) => setHba1c(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "e.g., 6.5" })] })) : (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Average Glucose (mg/dL)" }), _jsx("input", { type: "number", value: glucose, onChange: (e) => setGlucose(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none", placeholder: "e.g., 140" })] })), _jsx("button", { onClick: calculate, className: "w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors", children: "Convert" }), result && (_jsxs("div", { className: "p-4 bg-slate-50 rounded-xl text-center", children: [_jsxs("p", { className: "text-3xl font-bold text-slate-900", children: [result.value, " ", result.unit] }), _jsx("p", { className: `text-lg font-semibold ${result.color}`, children: result.interpretation }), _jsx("p", { className: "text-xs text-slate-600 mt-3 leading-relaxed", children: "Conversion between HbA1c and average glucose is approximate and can vary with anemia, kidney disease, and hemoglobin variants. Confirm diagnosis and treatment goals using lab-based testing and clinician guidance." })] }))] }));
};
const calculatorComponents = {
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
const Tools = () => {
    const [selectedTool, setSelectedTool] = useState(null);
    const [filter, setFilter] = useState('all');
    const filteredTools = filter === 'all' ? tools : tools.filter(t => t.category === filter);
    const CalculatorComponent = selectedTool ? calculatorComponents[selectedTool.id] : null;
    if (selectedTool && CalculatorComponent) {
        const colors = categoryColors[selectedTool.category];
        return (_jsx("div", { className: "min-h-screen bg-slate-50 py-12", children: _jsxs("div", { className: "container mx-auto px-4 max-w-2xl", children: [_jsxs("button", { onClick: () => setSelectedTool(null), className: "flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors", children: [_jsx(ArrowLeft, { size: 20 }), _jsx("span", { children: "Back to all calculators" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-3xl shadow-xl overflow-hidden", children: [_jsx("div", { className: `p-8 ${colors.bg} border-b ${colors.border}`, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center`, children: selectedTool.icon }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900", children: selectedTool.name }), _jsx("p", { className: "text-slate-600", children: selectedTool.description })] })] }) }), _jsxs("div", { className: "p-8", children: [_jsx(CalculatorComponent, {}), _jsx("div", { className: "mt-8 p-4 bg-slate-50 rounded-xl", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Info, { size: 18, className: "text-slate-400 mt-0.5" }), _jsx("p", { className: "text-xs text-slate-500", children: "This calculator provides estimates for informational purposes only. Always consult with a healthcare professional for medical advice, diagnosis, or treatment." })] }) })] })] })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-white border-b border-slate-200", children: _jsx("div", { className: "container mx-auto px-4 py-16", children: _jsxs("div", { className: "text-center max-w-3xl mx-auto", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6", children: [_jsx(Calculator, { size: 16 }), _jsx("span", { children: "18 Available Tools" })] }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold text-slate-900 mb-4", children: "Medical Calculators & Health Tools" }), _jsx("p", { className: "text-lg text-slate-600", children: "Accurate health calculators to help you track, assess, and understand your health metrics." })] }) }) }), _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx("div", { className: "flex flex-wrap justify-center gap-2 mb-8", children: [
                            { id: 'all', label: 'All Tools', count: tools.length },
                            { id: 'fitness', label: 'Fitness', count: tools.filter(t => t.category === 'fitness').length },
                            { id: 'pregnancy', label: 'Pregnancy', count: tools.filter(t => t.category === 'pregnancy').length },
                            { id: 'heart', label: 'Heart', count: tools.filter(t => t.category === 'heart').length },
                            { id: 'diabetes', label: 'Diabetes', count: tools.filter(t => t.category === 'diabetes').length },
                            { id: 'general', label: 'General', count: tools.filter(t => t.category === 'general').length },
                        ].map(cat => (_jsxs("button", { onClick: () => setFilter(cat.id), className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`, children: [cat.label, " (", cat.count, ")"] }, cat.id))) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "group bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white hover:shadow-xl transition-all cursor-pointer relative overflow-hidden", onClick: () => window.location.href = '/dictionary', children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform", children: _jsx(BookOpen, { size: 24 }) }), _jsx("span", { className: "px-2 py-1 bg-white/20 text-slate-900 text-xs font-semibold rounded-full", children: "\u2605 Featured" })] }), _jsx("h3", { className: "text-lg font-bold mb-2 text-slate-900", children: "Medical Dictionary" }), _jsx("p", { className: "text-slate-700 text-sm mb-4", children: "A-Z reference with definitions, etymology, pronunciation & clinical usage" }), _jsxs("div", { className: "flex items-center text-slate-900 text-sm font-medium", children: [_jsx("span", { children: "Browse Dictionary" }), _jsx(ChevronRight, { size: 16, className: "group-hover:translate-x-1 transition-transform" })] })] })] }), filteredTools.map((tool, index) => {
                                const colors = categoryColors[tool.category];
                                return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, onClick: () => setSelectedTool(tool), className: "group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: `w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center group-hover:scale-110 transition-transform`, children: tool.icon }), _jsxs("div", { className: "flex gap-1", children: [tool.popular && (_jsx("span", { className: "px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full", children: "\u2605 Popular" })), _jsx("span", { className: `px-2 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full capitalize`, children: tool.category })] })] }), _jsx("h3", { className: "text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors", children: tool.name }), _jsx("p", { className: "text-sm text-slate-500 mb-4", children: tool.description }), _jsxs("div", { className: "flex items-center text-blue-600 text-sm font-medium", children: [_jsx("span", { children: "Use Calculator" }), _jsx(ChevronRight, { size: 16, className: "group-hover:translate-x-1 transition-transform" })] })] }, tool.id));
                            })] }), filteredTools.length === 0 && (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-slate-500", children: "No tools found in this category." }) }))] })] }));
};
export default Tools;
//# sourceMappingURL=Tools.js.map