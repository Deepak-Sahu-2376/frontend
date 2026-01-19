import React from 'react';
import { ShieldCheck, TrendingUp, Users, Clock, Award, Leaf } from 'lucide-react';

const WhyChooseUsSection = () => {
    const features = [
        {
            icon: ShieldCheck,
            title: "Trusted & Verified",
            desc: "Every listing on DeshRock is physically verified by our experts to ensure zero fraud."
        },
        {
            icon: TrendingUp,
            title: "Best Market Rates",
            desc: "We negotiate the best deals for you, ensuring high ROI and value for money properties."
        },
        {
            icon: Users,
            title: "Expert Guidance",
            desc: "Our dedicated relationship managers guide you through every step of the buying process."
        },
        {
            icon: Clock,
            title: "Fast Processing",
            desc: "Streamlined documentation and loan assistance to get you your dream home faster."
        },
        {
            icon: Award,
            title: "Award Winning",
            desc: "Recognized as the most trusted real estate platform in the region for 3 years running."
        },
        {
            icon: Leaf,
            title: "Sustainable Living",
            desc: "We prioritize eco-friendly and sustainable housing projects for a better future."
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#A17F5A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DeshRock?</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        We don't just sell properties; we build lasting relationships based on trust, transparency, and expertise.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="group p-8 border border-gray-100 rounded-2xl bg-white hover:shadow-xl hover:border-[#A17F5A]/30 transition-all duration-300">
                                <div className="w-14 h-14 bg-[#A17F5A]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#A17F5A] transition-colors duration-300">
                                    <Icon className="w-7 h-7 text-[#A17F5A] group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#A17F5A] transition-colors">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed group-hover:text-gray-600">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
