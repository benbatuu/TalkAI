// src/components/TermsModal.tsx
import React from 'react';
import Modal from './Modal'; // Yeni Modal bileşeninizin yolu
import ModernButton from './ModernButton'; // ModernButton bileşeninizin yolu

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
            <div className="text-gray-600 text-left dark:text-gray-300 h-64 overflow-y-auto pr-2 custom-scrollbar">
                <p className="mb-4">Welcome to YourApp! These Terms of Service ("Terms") govern your use of YourApp's website, products, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.</p>
                <p className="mb-4"><strong>1. Acceptance of Terms:</strong> By creating an account, accessing, or using the Services, you affirm that you are at least 18 years old or have reached the age of majority in your jurisdiction, and that you agree to be bound by these Terms.</p>
                <p className="mb-4"><strong>2. User Accounts:</strong> You may need to register an account to access certain features of the Services. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
                <p className="mb-4"><strong>3. User Conduct:</strong> You agree not to use the Services for any unlawful purpose or in any way that might harm, abuse, or otherwise interfere with the Services or any other user's enjoyment of the Services.</p>
                <p className="mb-4"><strong>4. Intellectual Property:</strong> All content, trademarks, service marks, trade names, and logos are the property of YourApp or its licensors. You are granted a limited, non-exclusive, non-transferable license to access and use the Services for your personal, non-commercial use only.</p>
                <p className="mb-4"><strong>5. Privacy Policy:</strong> Your use of the Services is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your personal information.</p>
                <p className="mb-4"><strong>6. Disclaimers:</strong> The Services are provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
                <p className="mb-4"><strong>7. Limitation of Liability:</strong> In no event shall YourApp be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Services; (ii) any conduct or content of any third party on the Services; (iii) any content obtained from the Services; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>
                <p className="mb-4"><strong>8. Changes to Terms:</strong> We reserve the right to modify these Terms at any time. If we make changes, we will provide you with notice such as by sending an email, posting a notice on the Services, or updating the date at the top of these Terms. Your continued use of the Services after any such change constitutes your acceptance of the new Terms of Service.</p>
                <p className="mb-4"><strong>9. Governing Law:</strong> These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.</p>
                <p className="mb-4"><strong>10. Contact Us:</strong> If you have any questions about these Terms, please contact us at support@yourapp.com.</p>
            </div>
            <div className="flex justify-center mt-6">
                <ModernButton onClick={onClose}>
                    Close
                </ModernButton>
            </div>
        </Modal>
    );
};

export default TermsModal;