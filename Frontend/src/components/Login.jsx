import React, { useState } from 'react';

// Логіка залишається тією ж самою
function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        // 1. Створюємо контейнер на весь екран, щоб відцентрувати форму
        <div className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col justify-center items-center p-4">

            {/* 2. Додаємо логотип */}
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
                F1<span className="text-red-600">.</span>Journal
            </h1>

            {/* 3. Сама картка форми */}
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">

                {/* 4. Заголовок та підзаголовок */}
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-2">
                    Вхід у систему
                </h2>
                <p className="text-zinc-400 text-center mb-8">
                    Ласкаво просимо!
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6"> {/* Збільшив 'gap' */}

                    {/* 5. Покращені поля вводу */}
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
                        className="w-full py-3 mt-2 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    >
                        Увійти
                    </button>
                </form>

                {/* 6. Посилання на реєстрацію */}
                <div className="mt-8 text-center">
                    <p className="text-zinc-400">
                        Ще не маєте акаунту?{' '}
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