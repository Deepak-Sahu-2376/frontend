import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: "url('/assets/hero_bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                    Ready to Find Your <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                        Dream Home?
                    </span>
                </h2>

                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of happy families who found their perfect property with DeshRock.
                    Let's turn your real estate goals into reality today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/properties">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all duration-300 border border-orange-400/20"
                        >
                            Explore Properties
                        </Button>
                    </Link>
                    <Link to="/contact">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:text-white px-8 py-6 rounded-xl text-lg font-semibold transition-all duration-300 group"
                        >
                            Contact an Expert
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
