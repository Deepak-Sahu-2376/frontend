import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, User, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { api } from '../utils/apiClient';
import { toast } from 'sonner';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';

import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ScheduleVisitForm = ({
    isOpen,
    onClose,
    title = "this property",
    propertyId
}) => {
    // Auth Check
    const { isAuthenticated, user, fetchUserProfile } = useUser();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: ''
    });

    // Fetch latest profile to ensure we have phone number
    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [isAuthenticated]);

    // Autofill user details if logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || prev.email,
                fullName: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : '')?.trim() || prev.fullName,
                phoneNumber: user.phone || user.phoneNumber || user.mobile || user.contactNumber || prev.phoneNumber
            }));
        }
    }, [user]);

    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [selectedTime, setSelectedTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollContainerRef = useRef(null);

    // Initial message update
    useEffect(() => {
        if (title) {
            setFormData(prev => ({
                ...prev,
                message: `I would like to schedule a tour for [ ${title} ].`
            }));
        }
    }, [title]);

    // Cleanup when closed (only relevant for modal usage)
    useEffect(() => {
        if (!isOpen && onClose) {
            // Optional: reset state here if desired
        }
    }, [isOpen, onClose]);

    // If it's a modal and not open, don't render
    if (!isOpen && onClose) return null;

    // Generate next 14 days
    const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

    // Time slots (10 AM to 7 PM)
    const timeSlots = [
        "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
        "06:00 PM", "06:30 PM", "07:00 PM"
    ];

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Please login to schedule a visit");
            navigate('/sign-in');
            return;
        }

        if (!selectedTime) {
            toast.error("Please select a time for your visit.");
            return;
        }

        setIsSubmitting(true);


        try {
            // Simple parsing of time string to hours/minutes
            const [timeStr, period] = selectedTime.split(' ');
            let [hours, minutes] = timeStr.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            const visitDateTime = new Date(selectedDate);
            visitDateTime.setHours(hours, minutes, 0, 0);

            const payload = {
                propertyId: parseInt(propertyId) || 0, // Fallback if propertyId is missing
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                preferredVisitTime: visitDateTime.toISOString(),
                visitType: 'in_person', // Default to in_person
                message: formData.message
            };

            // API call
            const response = await api.post('/api/v1/visits', payload);

            if (response) {
                toast.success("Visit scheduled successfully!");
                onClose && onClose(); // Only call onClose if it exists
            }
        } catch (error) {
            console.error("Schedule Visit Error:", error);
            // Show more specific error if available
            const msg = error.response?.data?.message || error.message || "Failed to schedule visit.";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to render content
    const FormContent = () => (
        <div className="bg-white rounded-3xl w-full p-6 md:p-8 relative shadow-none">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-8">Schedule a tour</h2>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Date Selection */}
                <div className="relative group">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-[#A17F5A] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 scroll-smooth"
                    >
                        {dates.map((date) => {
                            const isSelected = isSameDay(date, selectedDate);
                            return (
                                <button
                                    key={date.toISOString()}
                                    type="button"
                                    onClick={() => setSelectedDate(date)}
                                    className={`flex flex-col items-center justify-center min-w-[72px] h-20 rounded-xl border transition-all duration-200 ${isSelected
                                        ? 'border-[#A17F5A] bg-[#A17F5A]/5 text-[#A17F5A] shadow-sm'
                                        : 'border-gray-200 bg-white text-gray-500 hover:border-[#A17F5A]/50 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-xs font-medium uppercase tracking-wide">
                                        {format(date, 'EEE')}
                                    </span>
                                    <span className={`text-xl font-bold my-0.5 ${isSelected ? 'text-[#A17F5A]' : 'text-gray-900'}`}>
                                        {format(date, 'd')}
                                    </span>
                                    <span className="text-xs font-medium">
                                        {format(date, 'MMM')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-[#A17F5A] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Time Selection */}
                <div className="space-y-4">
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A17F5A]/20 focus:border-[#A17F5A] transition-all appearance-none cursor-pointer"
                        style={{ backgroundImage: 'none' }}
                    >
                        <option value="" disabled>Please select the time</option>
                        {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>



                <div className="space-y-4 pt-2">
                    <h3 className="font-semibold text-gray-900">Your information</h3>

                    <div className="space-y-4">
                        <Input
                            placeholder="Your Name"
                            className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Your Email"
                            className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            type="tel"
                            placeholder="Your Phone"
                            className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                            value={formData.phoneNumber}
                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            required
                        />
                        <Textarea
                            placeholder="Message"
                            className="min-h-[100px] bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors resize-none p-4"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#B2845A] hover:bg-[#976d47] text-white h-14 rounded-xl text-lg font-semibold shadow-lg shadow-[#B2845A]/20 transition-all active:scale-[0.98]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending Request...' : 'Send Request'}
                </Button>
            </form>
        </div>
    );

    // If explicit onClose is passed, treat as modal, otherwise embedded
    if (onClose) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto">
                    <FormContent />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <FormContent />
        </div>
    );
};

export default ScheduleVisitForm;
