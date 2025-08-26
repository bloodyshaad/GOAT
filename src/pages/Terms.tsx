import React from 'react';
import { Link } from 'react-router-dom';

export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using GOAT e-commerce platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of GOAT materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2>3. Account Terms</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>

            <h2>4. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>

            <h2>5. Prohibited Uses</h2>
            <p>
              You may not use our service:
            </p>
            <ul>
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2>6. Products and Services</h2>
            <p>
              Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
            </p>

            <h2>7. Payment Terms</h2>
            <p>
              We accept various forms of payment and reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              In no case shall GOAT, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul>
              <li>Email: legal@goat-ecommerce.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Fashion Street, Style City, SC 12345</li>
            </ul>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}