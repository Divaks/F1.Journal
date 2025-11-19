import React, { useState } from 'react';
import toast from 'react-hot-toast';

function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // onLogin - це проп з App.jsx
            await onLogin(email, password);
        } catch (error) {
            // помилка обробляється всередині onLogin в App.jsx через toast
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col justify-center items-center p-4">

            <h1 className="text-4xl font-bold text-gray-100 mb-2">
                F1<span className="text-red-600">.</span>Journal
            </h1>

            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">

                <h2 className="text-3xl font-bold text-center text-gray-100 mb-2">
                    Увійти
                </h2>
                <p className="text-zinc-400 text-center mb-8">
                    Увійдіть, щоб продовжити.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Пароль"
                            className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 mt-2 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:bg-zinc-600"
                    >
                        {isSubmitting ? 'Вхід...' : 'Увійти'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-zinc-400">
                        Не маєте акаунту?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="font-semibold text-red-500 hover:text-red-400 hover:underline focus:outline-none focus:underline"
                        >
                            Зареєструватися
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;