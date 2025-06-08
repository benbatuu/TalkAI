// src/components/PrivacyModal.tsx
import React from 'react';
import Modal from './Modal'; // Yeni Modal bileşeninizin yolu
import ModernButton from './ModernButton'; // ModernButton bileşeninizin yolu

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
            <div className="text-gray-600 text-left dark:text-gray-300 h-64 overflow-y-auto pr-2 custom-scrollbar">
                <p className="mb-4">YourApp ("we", "us", or "our") is committed to protecting the privacy of your personal information. This Privacy Policy describes how we collect, use, and disclose information that we obtain about visitors to our website [yourwebsite.com] and users of our services (collectively, the "Services").</p>
                <p className="mb-4"><strong>1. Information We Collect:</strong> We collect personal information that you voluntarily provide to us when you register for the Services, express an interest in obtaining information about us or our products and services, when you participate in activities on the Services, or otherwise when you contact us.</p>
                <p className="mb-4"><strong>2. How We Use Your Information:</strong> We use personal information collected via our Services for a variety of business purposes described below:</p>
                <ul className="list-disc list-inside mb-4 pl-4">
                    <li>To facilitate account creation and logon process.</li>
                    <li>To send you marketing and promotional communications.</li>
                    <li>To respond to your inquiries and offer support.</li>
                    <li>To improve our Services and user experience.</li>
                    <li>To enforce our terms, conditions, and policies.</li>
                </ul>
                <p className="mb-4"><strong>3. Sharing Your Information:</strong> We only share and disclose your information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                <p className="mb-4"><strong>4. Data Security:</strong> We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
                <p className="mb-4"><strong>5. Your Privacy Rights:</strong> In some regions, such as the European Economic Area, you have rights that allow you greater access to and control over your personal information. These may include the right to request access, rectification, erasure, restriction of processing, objection to processing, and data portability.</p>
                <p className="mb-4"><strong>6. Changes to This Privacy Policy:</strong> We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.</p>
                <p className="mb-4"><strong>7. Contact Us:</strong> If you have questions or comments about this policy, you may email us at support@yourapp.com or contact us by post at:</p>
                <p className="mb-4">YourApp Inc.<br />[Your Company Address]<br />[Your City, Postal Code, Country]</p>
            </div>
            <div className="flex justify-center mt-6">
                <ModernButton onClick={onClose}>
                    Close
                </ModernButton>
            </div>
        </Modal>
    );
};

export default PrivacyModal;