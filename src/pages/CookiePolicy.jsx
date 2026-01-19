import React from 'react';
import SEO from '../components/SEO';

const CookiePolicy = () => {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <SEO title="Cookie Policy" description="Cookie Policy for DeshRock" />
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Cookie Policy</h1>

            <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">1. What Are Cookies</h2>
                    <p>
                        Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser.
                        These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Cookies</h2>
                    <p>
                        As most of the online services, our website uses first-party and third-party cookies for several purposes.
                        First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.
                    </p>
                    <p className="mt-2">
                        The third-party cookies used on our website are mainly for understanding how the website performs, how you interact with our website, keeping our services secure,
                        providing advertisements that are relevant to you, and all in all providing you with a better and improved user experience.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Types of Cookies We Use</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Essential Cookies:</strong> Some cookies are essential for you to be able to experience the full functionality of our site.</li>
                        <li><strong>Analytical Cookies:</strong> These cookies store information about the number of visitors, origin of visitors, and pages visited.</li>
                        <li><strong>Functional Cookies:</strong> These are the cookies that help certain non-essential functionalities on our website.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default CookiePolicy;
