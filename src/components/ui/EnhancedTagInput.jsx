import React, { useState } from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { Label } from './label';

const EnhancedTagInput = ({ label, value = [], onChange, placeholder, suggestions = [] }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    const addTag = (tag) => {
        const trimmed = tag?.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    const toggleSuggestion = (suggestion) => {
        if (value.includes(suggestion)) {
            removeTag(suggestion);
        } else {
            addTag(suggestion);
        }
    };

    return (
        <div className="space-y-3 border rounded-lg p-4 bg-card/50">
            <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">{label}</Label>
                <span className="text-xs text-muted-foreground">{value.length} selected</span>
            </div>

            <div className="border rounded-xl p-3 bg-white focus-within:ring-2 focus-within:ring-ring ring-offset-background transition-all">
                <div className="flex flex-wrap gap-2 mb-2">
                    {value.map((tag, index) => (
                        <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive focus:outline-none transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none focus:outline-none text-sm placeholder:text-muted-foreground outline-none"
                />
                <p className="text-xs text-muted-foreground mt-2">Tip: Press <kbd className="px-1 py-0.5 rounded bg-muted border font-mono text-[10px]">Enter</kbd> to add a custom tag.</p>
            </div>

            {suggestions.length > 0 && (
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span>Popular Suggestions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(suggestion => {
                            const isSelected = value.includes(suggestion);
                            return (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => toggleSuggestion(suggestion)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm border transition-all duration-200 flex items-center gap-2
                                        ${isSelected
                                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                            : 'bg-background hover:bg-muted/50 border-input text-foreground hover:border-primary/50'
                                        }
                                    `}
                                >
                                    {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                    {suggestion}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedTagInput;
