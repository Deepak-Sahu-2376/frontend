import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming cn utility exists, otherwise standard class concatenation
import { Label } from './label';

// If cn doesn't exist, we can use a simple join:
// const cn = (...classes) => classes.filter(Boolean).join(' ');

const SearchableDropdown = ({
    label,
    options = [],
    value = [], // Array of selected strings
    onChange,
    placeholder = "Select...",
    allowCustom = false,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !value.includes(option)
    );

    const handleSelect = (option) => {
        onChange([...value, option]);
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const handleRemove = (optionToRemove) => {
        onChange(value.filter(option => option !== optionToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            e.preventDefault();
            if (allowCustom) {
                // Add custom value if not already selected
                if (!value.includes(searchTerm.trim())) {
                    handleSelect(searchTerm.trim());
                }
            } else if (filteredOptions.length > 0) {
                // Select first option if available and custom not allowed (optional behavior)
                handleSelect(filteredOptions[0]);
            }
        } else if (e.key === 'Backspace' && !searchTerm && value.length > 0) {
            handleRemove(value[value.length - 1]);
        }
    };

    return (
        <div className={cn("space-y-2", className)} ref={wrapperRef}>
            {label && <Label>{label}</Label>}
            <div
                className="min-h-[10px] p-2 border rounded-md bg-white focus-within:ring-2 focus-within:ring-ring focus-within:border-primary cursor-text flex flex-wrap gap-2 items-center relative"
                onClick={() => {
                    inputRef.current?.focus();
                    setIsOpen(true);
                }}
            >
                {value.map((item, index) => (
                    <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm flex items-center gap-1 animate-in fade-in zoom-in duration-200"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(item);
                            }}
                            className="hover:text-destructive focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <div className="flex-1 min-w-[120px] flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-transparent border-none focus:outline-none text-sm p-1"
                        placeholder={value.length === 0 ? placeholder : ""}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto opacity-50 absolute right-3 top-3 pointer-events-none" />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={index}
                                className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm flex justify-between items-center"
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                            {allowCustom && searchTerm.trim() ? (
                                <div
                                    className="cursor-pointer text-primary hover:underline"
                                    onClick={() => handleSelect(searchTerm.trim())}
                                >
                                    Create "{searchTerm}"
                                </div>
                            ) : (
                                "No results found."
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
