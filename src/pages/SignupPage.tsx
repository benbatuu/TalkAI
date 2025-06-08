import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Kayıt işlemleri burada yapılacak
        console.log('Kayıt olunuyor:', { name, email, password, confirmPassword });
        // Şifrelerin eşleşip eşleşmediğini kontrol etme vb. eklenebilir.
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-sm">
                <h3 className="text-2xl font-bold text-center">Yeni Hesap Oluşturun</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="name">Adınız</label>
                            <input
                                type="text"
                                placeholder="Adınız"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="email">E-posta</label>
                            <input
                                type="email"
                                placeholder="E-posta"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="password">Şifre</label>
                            <input
                                type="password"
                                placeholder="Şifre"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="confirmPassword">Şifre Tekrarı</label>
                            <input
                                type="password"
                                placeholder="Şifre Tekrarı"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-baseline justify-end mt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                            >
                                Kayıt Ol
                            </button>
                        </div>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm">Zaten bir hesabınız var mı? <Link to="/login" className="text-blue-600 hover:underline">Giriş Yap</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage; 