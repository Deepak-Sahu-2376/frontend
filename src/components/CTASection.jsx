import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A17F5A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    Ready to Find Your <span className="text-[#A17F5A]">Dream Home?</span>
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    Join thousands of happy families who found their perfect property with DeshRock. Let's start your journey today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/properties">
                        <Button size="lg" className="w-full sm:w-auto bg-[#A17F5A] hover:bg-[#8e6f4e] text-white px-8 py-7 rounded-lg text-lg font-semibold shadow-lg hover:shadow-[#A17F5A]/20 transition-all duration-300">
                            Explore Properties
                        </Button>
                    </Link>
                    <Link to="/contact">
                        <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 px-8 py-7 rounded-lg text-lg font-semibold transition-all duration-300 group shadow-lg">
                            Contact an Expert <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
