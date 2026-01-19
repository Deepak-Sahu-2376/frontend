import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { api } from '../utils/apiClient';
import { toast } from 'sonner';

const ScheduleVisitForm = ({
    isOpen,
    onClose,
    title = "this property",
    propertyId
}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        preferredVisitTime: '',
        message: 'Interested in viewing the property.'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            propertyId: parseInt(propertyId),
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            // input type="datetime-local" returns "YYYY-MM-DDTHH:mm"
            // Backend expects "YYYY-MM-DDTHH:mm:ss"
            preferredVisitTime: formData.preferredVisitTime ? `${formData.preferredVisitTime}:00` : null,
            message: formData.message
        };

        try {
            const response = await api.post('/api/v1/visits', payload);
            if (response) {
                toast.success("Visit scheduled successfully!");
                onClose();
                // Optional: Reset form or keep common data
            }
        } catch (error) {
            console.error("Schedule Visit Error:", error);
            toast.error(error.message || "Failed to schedule visit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#A17F5A]" />
                        Schedule a Visit
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-500">Property</p>
                    <p className="font-medium text-gray-900 line-clamp-1">{title}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <Input
                            placeholder="Your name"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                            type="email"
                            placeholder="Your email"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <Input
                            type="tel"
                            placeholder="Your phone number"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            value={formData.phoneNumber}
                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Preferred Time</label>
                        <Input
                            type="datetime-local"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            value={formData.preferredVisitTime}
                            onChange={e => setFormData({ ...formData, preferredVisitTime: e.target.value })}
                            min={new Date().toISOString().slice(0, 16)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <Textarea
                            placeholder="Any specific questions?"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors min-h-[80px] resize-none"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#A17F5A] hover:bg-[#8B6E4E] text-white mt-2 h-11 text-base"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Scheduling...' : 'Confirm Visit'}
                    </Button>
                </form>

            </div>
        </div>
    );
};

export default ScheduleVisitForm;
