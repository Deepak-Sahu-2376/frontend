import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Rahul Verma",
            role: "Software Engineer",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
            text: "I was looking for a flat in Gurgaon for months. DeshRock made it incredibly easy. Their team understood my needs perfectly and found me a great deal.",
            rating: 5
        },
        {
            name: "Priya Singh",
            role: "Entrepreneur",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            text: "The level of professionalism at DeshRock is unmatched. They handled all the paperwork seamlessly. Highly recommended for anyone looking to invest.",
            rating: 5
        },
        {
            name: "Amit & Neha",
            role: "First-time Homebuyers",
            image: "https://images.unsplash.com/photo-1628890929665-f81d603a187f?auto=format&fit=crop&q=80&w=200",
            text: "Buying our first home felt daunting until we met the experts at DeshRock. They were patient, transparent, and guided us through every step.",
            rating: 5
        }
    ];

    return (
        <section className="py-24 bg-[#f9f9f9]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
                    <p className="text-gray-600 text-lg">Don't just take our word for it. Hear from our happy homeowners.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, index) => (
                                    <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-8 flex-grow leading-relaxed">"{t.text}"</p>
                            <div className="flex items-center gap-4 mt-auto">
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#A17F5A]/20" />
                                <div>
                                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                                    <p className="text-sm text-[#A17F5A] font-medium">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
