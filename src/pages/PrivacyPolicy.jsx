import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <SEO title="Privacy Policy" description="Privacy Policy for DeshRock" />
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>

            <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
                    <p>
                        Welcome to DeshRock. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Identity Data (name, username)</li>
                        <li>Contact Data (email address, telephone numbers)</li>
                        <li>Technical Data (IP address, browser type)</li>
                        <li>Usage Data (how you use our website)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>To provide and maintain our service</li>
                        <li>To notify you about changes to our service</li>
                        <li>To provide customer support</li>
                        <li>To gather analysis or valuable information so that we can improve our service</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at: Deshrockpvt.ltd@gmail.com
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
