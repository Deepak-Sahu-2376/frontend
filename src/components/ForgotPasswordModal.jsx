import { useState } from "react";
import { X, Mail, Lock, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

export function ForgotPasswordModal({ isOpen, onClose, initialEmail = "" }) {
    const { forgotPassword, resetPassword } = useUser();
    const [step, setStep] = useState(1); // 1: email, 2: otp+password
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        identifier: initialEmail,
        otpCode: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!isOpen) return null;

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await forgotPassword(formData.identifier);
            if (result.success) {
                toast.success(result.message || "OTP sent to your email!");
                setStep(2);
            } else {
                toast.error(result.message || "Failed to send OTP");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(
                formData.identifier,
                formData.otpCode,
                formData.newPassword,
                formData.confirmPassword
            );

            if (result.success) {
                toast.success("Password reset successful!");
                onClose();
                setStep(1);
                setFormData({
                    identifier: "",
                    otpCode: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(result.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X className="h-5 w-5" />
                </button>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
                            <p className="text-slate-600 mt-2">
                                Enter your email and we'll send you an OTP to reset your password
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email or Username</Label>
                            <Input
                                id="reset-email"
                                type="text"
                                placeholder="Enter your email or username"
                                value={formData.identifier}
                                onChange={(e) =>
                                    setFormData({ ...formData, identifier: e.target.value })
                                }
                                className="h-11"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-primary hover:bg-primary/90"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Sending OTP...
                                </>
                            ) : (
                                "Send OTP"
                            )}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                            <p className="text-slate-600 mt-2">
                                Enter the OTP sent to <span className="font-semibold">{formData.identifier}</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="otp">Verification Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={formData.otpCode}
                                onChange={(e) =>
                                    setFormData({ ...formData, otpCode: e.target.value })
                                }
                                className="h-11 text-center text-lg tracking-widest"
                                maxLength={6}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password (min 6 chars)"
                                    value={formData.newPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, newPassword: e.target.value })
                                    }
                                    className="h-11 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <Lock className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    className="h-11 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <Lock className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="flex-1 h-11"
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-11 bg-primary hover:bg-primary/90"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
