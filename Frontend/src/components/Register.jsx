import React, { useState } from 'react';

// Логіка залишається тією ж самою
function Register({ onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Додав стан для кнопки

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true); // Блокуємо кнопку

        try {
            const response = await fetch('https://f1-journal.onrender.com/api/users', { // Потрібно буде передати API_BASE_URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                alert("Реєстрація успішна! Тепер можете увійти.");
                onSwitchToLogin();
            } else {
                const text = await response.text();
                setError(text || "Помилка реєстрації");
            }
        } catch (err) {
            console.log(err);
            setError("Помилка зʼєднання.");
        } finally {
            setIsSubmitting(false); // Розблокуємо кнопку
        }
    };

    return (
        // 1. Такий самий повноекранний контейнер
        <div className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col justify-center items-center p-4">

            {/* 2. Такий самий логотип */}
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
                F1<span className="text-red-600">.</span>Journal
            </h1>

            {/* 3. Така сама картка */}
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">

                {/* 4. Заголовок та підзаголовок */}
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-2">
                    Створити акаунт
                </h2>
                <p className="text-zinc-400 text-center mb-8">
                    Приєднуйтесь до спільноти.
                </p>

                {/* Повідомлення про помилку */}
                {error && <p className="text-red-500 text-center mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* 5. Такі самі поля вводу */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">Ім'я</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Ваше ім'я"
                            className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                        disabled={isSubmitting} // Блокуємо кнопку під час запиту
                        className="w-full py-3 mt-2 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:bg-zinc-600"
                    >
                        {isSubmitting ? 'Створення...' : 'Зареєструватися'}
                    </button>
                </form>

                {/* 6. Посилання на вхід */}
                <div className="mt-8 text-center">
                    <p className="text-zinc-400">
                        Вже маєте акаунт?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="font-semibold text-red-500 hover:text-red-400 hover:underline focus:outline-none focus:underline"
                        >
                            Увійти
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;