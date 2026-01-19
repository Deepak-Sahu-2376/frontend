import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";

const FAQSection = () => {
    const faqs = [
        {
            question: "How do I start the process of buying a home?",
            answer: "Starting is easy! Simply browse our listings or contact one of our agents. We'll schedule a consultation to understand your needs and budget, then guide you through property viewing, verification, and paperwork."
        },
        {
            question: "What does contingent mean in real estate?",
            answer: "A 'contingent' offer means the deal depends on certain conditions being met, such as a home inspection, financing approval, or the sale of the buyer's current home. If these conditions aren't met, the contract can be voided without penalty."
        },
        {
            question: "Are real estate taxes the same as property taxes?",
            answer: "In most contexts, yes. Real estate tax is a type of property tax specifically levied on immovable property like land and buildings. However, 'property tax' can sometimes refer more broadly to taxes on personal property (like cars or boats) depending on the jurisdiction."
        },
        {
            question: "Is real estate a good investment?",
            answer: "Generally, yes. Real estate can generate passive income through rentals and offers potential for long-term appreciation. It is often seen as a hedge against inflation. Our experts can help you analyze potential returns ('how real estate make money') for specific properties."
        },
        {
            question: "Do I need a real estate attorney?",
            answer: "While not always legally required in every state, having a real estate attorney is highly recommended to review contracts, handle title issues, and ensure a smooth closing, especially for complex transactions."
        },
        {
            question: "What does a real estate appraiser do?",
            answer: "A real estate appraiser provides an unbiased estimate of a property's market value. This is crucial for lenders to ensure the loan amount is appropriate for the home's value."
        },
        {
            question: "Is real estate a good career?",
            answer: "Real estate can be a highly rewarding career for self-motivated individuals. It offers flexibility, unlimited income potential, and the satisfaction of helping people find their dream homes. However, it requires dedication and hard work ('real estate is fun' but also demanding)."
        },
        {
            question: "What is the difference between a real estate agent and a broker?",
            answer: "A real estate agent is licensed to help people buy and sell property but must work under a sponsoring broker. A real estate broker has completed closer training and can work independently or hire agents to work for them. At DeshRock, we work with top-tier professionals from both categories."
        },
        {
            question: "Can I buy a house without a real estate agent?",
            answer: "Yes, you can, but it comes with risks. An agent navigates the complex paperwork, negotiations, and legal requirements for you. Buying without one might save commission but could cost you more in the long run if you miss critical details or overpay."
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600 text-lg">Detailed answers to your most common queries</p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100">
                            <AccordionTrigger className="text-left text-lg font-medium text-gray-800 hover:text-[#A17F5A] hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed text-base pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FAQSection;
