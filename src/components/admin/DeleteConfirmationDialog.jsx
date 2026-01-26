import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName,
    description = "This action cannot be undone. This will permanently delete the item and remove all associated data and files."
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setInputValue('');
            setIsDeleting(false);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (inputValue !== itemName) return;

        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    const isMatch = inputValue === itemName;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertTriangle className="h-6 w-6" />
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2 text-left">
                        {description}
                    </DialogDescription>
                    <DialogDescription className="pt-2 font-medium text-left text-gray-900">
                        Please type <span className="font-bold select-all bg-gray-100 px-1 rounded">{itemName}</span> to confirm.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type the name here"
                        className="w-full"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && isMatch && !isDeleting) {
                                handleConfirm();
                            }
                        }}
                    />
                </div>

                <DialogFooter className="gap-2 sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!isMatch || isDeleting}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></span>
                                Deleting...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete permanently
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
