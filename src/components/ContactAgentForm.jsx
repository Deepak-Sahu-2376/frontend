import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { api } from '../utils/apiClient';
import { toast } from 'sonner';

const ContactAgentForm = ({
    isOpen,
    onClose,
    title = "this property",
    projectId = null,
    propertyId = null,
    phaseId = null
}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: `I'm interested in ${title}...`
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Construct payload - only include the ID that is present
        const payload = {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phoneNumber,
            message: formData.message,
            projectId: projectId,
            propertyId: propertyId,
            phaseId: phaseId
        };

        // Remove null keys if necessary, but backend likely handles nulls. 
        // Based on user request "use only one", passing nulls for others should be fine 
        // as long as one is set.

        try {
            const response = await api.post('/api/v1/inquiries', payload);
            if (response) {
                toast.success("Inquiry sent successfully!");
                onClose();
                // Reset form slightly but keep name/email if they might want to enquire again? 
                // Better to reset for fresh state next time or keep data. 
                // Let's keep data for UX but reset message?
                // For now, simple component unmount/remount logic handles reset if parent matches it.
            }
        } catch (error) {
            console.error("Inquiry Error:", error);
            toast.error(error.message || "Failed to send inquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Contact Agent</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
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
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <Textarea
                            placeholder="Message"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors min-h-[100px] resize-none"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#A17F5A] hover:bg-[#8B6E4E] text-white mt-2 h-11 text-base"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>

            </div>
        </div>
    );
};

export default ContactAgentForm;
