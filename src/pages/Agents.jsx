import React from "react";
import { toast } from "sonner";
import { Phone, Mail, Calendar, Users } from "lucide-react";
import { agents } from "../data/agents";

const Agents = () => {
    return (
        <div className="pt-24 pb-20 bg-[#f7f7f7] min-h-screen mt-20 ">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <span className="text-[#a87a4c] text-3xl">🤝</span>
                        Meet Our Expert Agents
                    </h2>
                    <p className="text-gray-600 text-lg mt-2 max-w-2xl mx-auto">
                        Our experienced team of real estate professionals is dedicated to helping you find the
                        perfect property or achieve the best returns on your investment across India.
                    </p>
                </div>

                {/* GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {agents.map((a) => (
                        <div
                            key={a.id}
                            className="bg-white rounded-2xl border border-gray-200 h-[560px] flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* PROFILE */}
                            <div className="relative flex flex-col items-center pt-6 pb-2">
                                <img
                                    src={a.image}
                                    alt={a.name}
                                    className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                                />

                                <span className="absolute top-3 right-3 bg-[#a87a4c] text-white text-sm px-3 py-1 rounded-full shadow">
                                    ⭐ {a.rating}
                                </span>

                                <h3 className="text-xl font-bold mt-3">{a.name}</h3>
                                <p className="text-gray-500 text-sm -mt-1">{a.role}</p>

                                <div className="flex gap-3 mt-3">
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 text-xs rounded-md">
                                        {a.specialization}
                                    </span>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 text-xs rounded-md">
                                        {a.experience}
                                    </span>
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="px-6 text-sm text-gray-600 flex-grow flex flex-col">

                                {/* STATS */}
                                <div className="mb-1 flex justify-between">
                                    <span>🏷 Sales:</span>
                                    <span className="font-semibold">{a.sales}</span>
                                </div>

                                <div className="mb-1 flex justify-between">
                                    <span>🏠 Properties:</span>
                                    <span className="font-semibold">{a.properties}</span>
                                </div>

                                <div className="mb-3 flex justify-between">
                                    <span>🌐 Languages:</span>
                                    <span className="font-semibold">{a.languages}</span>
                                </div>

                                {/* FIXED HEIGHT DESCRIPTION */}
                                <p className="text-gray-500 text-sm mb-3 line-clamp-3">
                                    {a.description}
                                </p>

                                {/* AWARDS */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {a.awards.slice(0, 2).map((award, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                                        >
                                            {award}
                                        </span>
                                    ))}
                                </div>

                                {/* BUTTONS ALWAYS AT BOTTOM */}
                                <div className="mt-auto space-y-3 pb-4">
                                    <button
                                        onClick={() => toast.success(`Calling ${a.name}...`)}
                                        className="w-full bg-[#a87a4c] text-white py-2 rounded-md font-semibold hover:bg-[#906636] transition-colors"
                                    >
                                        📞 Call {a.name.split(" ")[0]}
                                    </button>
                                    <button
                                        onClick={() => toast.success(`Message sent to ${a.name}!`)}
                                        className="w-full border border-[#a87a4c] text-[#a87a4c] py-2 rounded-md font-semibold hover:bg-[#a87a4c] hover:text-white transition-colors"
                                    >
                                        💬 Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CALL TO ACTION SECTION */}
                <div className="mt-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Work with Our Experts?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
                        Whether you're buying, selling, or investing, our expert agents are here to guide you through
                        every step of your real estate journey with personalized service and market insights.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => toast.success("Opening consultation scheduler...")}
                            className="bg-[#a87a4c] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#906636] transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <Phone className="h-5 w-5" />
                            Schedule Consultation
                        </button>
                        <button
                            onClick={() => toast.success("Contact team form opened!")}
                            className="border border-[#a87a4c] text-[#a87a4c] px-8 py-3 rounded-lg font-semibold hover:bg-[#a87a4c] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Mail className="h-5 w-5" />
                            Contact Team
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Agents;
