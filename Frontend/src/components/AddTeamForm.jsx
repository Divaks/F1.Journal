import React, { useState } from 'react';
import toast from 'react-hot-toast';

// Логіка залишається тією ж самою
function AddTeamForm({ onTeamAdded, onCancel, API_BASE_URL, seasonId }) {
    const [name, setName] = useState('');
    const [base, setBase] = useState('');
    const [teamPrincipal, setTeamPrincipal] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        const token = localStorage.getItem('authToken');

        if (!seasonId || seasonId === 0) {
            toast.error("Помилка: неможливо створити команду без обраного сезону.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/seasons/${seasonId}/teams`, { // Переконайся, що API_BASE_URL передається з App.jsx
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    base,
                    teamPrincipal,
                    seasonId: seasonId,
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Помилка при створенні команди");
            }

            onTeamAdded();
            toast.success(`Команда успішно створена.`);

        } catch (e) {
            toast.error("Помилка мережі при створенні.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // 1. Повноекранний фон, як у Login/Register
        <div className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col justify-center items-center p-4">

            {/* 2. Картка форми */}
            <div className="w-full max-w-lg bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">

                {/* 3. Заголовок */}
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">
                    Додати нову команду
                </h2>

                {/* Повідомлення про помилку (якщо є) */}
                {error && (
                    <p className="text-red-500 text-center mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        {error}
                    </p>
                )}

                {/* 4. Форма зі стилізованими полями */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div>
                        <label htmlFor="team-name" className="block text-sm font-medium text-zinc-400 mb-2">
                            Назва команди
                        </label>
                        <input
                            type="text"
                            id="team-name"
                            placeholder="Наприклад, McLaren"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="team-base" className="block text-sm font-medium text-zinc-400 mb-2">
                            База команди
                        </label>
                        <input
                            type="text"
                            id="team-base"
                            placeholder="Наприклад, Maranello"
                            value={base}
                            onChange={(e) => setBase(e.target.value)}
                            required
                            className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="team-principal" className="block text-sm font-medium text-zinc-400 mb-2">
                            Керівник команди
                        </label>
                        <input
                            type="text"
                            id="team-principal"
                            placeholder="Наприклад, Toto Wolff"
                            value={teamPrincipal}
                            onChange={(e) => setTeamPrincipal(e.target.value)}
                            required
                            // Додаємо 'placeholder', щоб поле було гарним, поки дата не обрана
                            className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all [color-scheme:dark]"
                        />
                    </div>

                    {/* 5. Кнопки "Скасувати" та "Створити" */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="py-2 px-5 bg-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-600 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="py-2 px-5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-zinc-600"
                        >
                            {isSubmitting ? 'Створення...' : 'Створити команду'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTeamForm;