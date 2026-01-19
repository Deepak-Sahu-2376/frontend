import React, { useState, useEffect } from 'react';
import { Calculator, HelpingHand } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider'; // Assuming you have a Slider component, or I'll use a standard input range
import { Badge } from './ui/badge';

const EMICalculator = ({ propertyPrice = 5000000 }) => {
    const [amount, setAmount] = useState(propertyPrice);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);

    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    const calculateEMI = () => {
        const r = rate / 12 / 100;
        const n = tenure * 12;
        const emiValue = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        const totalPay = emiValue * n;
        const totalInt = totalPay - amount;

        setEmi(Math.round(emiValue));
        setTotalInterest(Math.round(totalInt));
        setTotalPayment(Math.round(totalPay));
    };

    useEffect(() => {
        calculateEMI();
    }, [amount, rate, tenure]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <Card className="border-gray-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-600" />
                    EMI Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">

                {/* Inputs */}
                <div className="space-y-6">
                    {/* Loan Amount */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                {formatCurrency(amount)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="100000"
                            max="50000000"
                            step="100000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>₹1L</span>
                            <span>₹5Cr</span>
                        </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Interest Rate (% p.a)</label>
                            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                {rate}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="15"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>1%</span>
                            <span>15%</span>
                        </div>
                    </div>

                    {/* Tenure */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Loan Tenure (Years)</label>
                            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                {tenure} Years
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>1 Yr</span>
                            <span>30 Yrs</span>
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-gray-900 rounded-xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Calculator className="w-24 h-24" />
                    </div>

                    <div className="relative z-10 text-center space-y-2 mb-6">
                        <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">Monthly EMI</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(emi)}</p>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Total Interest</p>
                            <p className="font-semibold">{formatCurrency(totalInterest)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Total Payment</p>
                            <p className="font-semibold">{formatCurrency(totalPayment)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <HelpingHand className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p>
                        Figures are estimates. Actual loan terms may vary based on bank policies and your credit profile.
                    </p>
                </div>

            </CardContent>
        </Card>
    );
};

export default EMICalculator;
