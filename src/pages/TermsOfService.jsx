import React from 'react';
import SEO from '../components/SEO';

const TermsOfService = () => {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <SEO title="Terms of Service" description="Terms of Service for DeshRock" />
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Terms of Service</h1>

            <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Agreement to Terms</h2>
                    <p>
                        By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.
                        If you do not agree with these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on DeshRock's website for personal,
                        non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Disclaimer</h2>
                    <p>
                        The materials on DeshRock's website are provided on an 'as is' basis. DeshRock makes no warranties, expressed or implied,
                        and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                        fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Limitations</h2>
                    <p>
                        In no event shall DeshRock or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                        or due to business interruption) arising out of the use or inability to use the materials on DeshRock's website.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
