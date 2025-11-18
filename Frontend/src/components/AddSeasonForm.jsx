import React, { useState } from 'react';
import toast from 'react-hot-toast';

// Логіка залишається тією ж самою
function AddSeasonForm({ onSeasonAdded, onCancel, API_BASE_URL }) {
    const [year, setYear] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/seasons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    year: parseInt(year),
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                // Спробуємо розпарсити помилку, якщо це JSON від валідації
                try {
                    const errorJson = JSON.parse(errorText);
                    // Якщо валідація (наприклад, "Year" required)
                    if (errorJson.errors && errorJson.errors.Year) {
                        throw new Error(errorJson.errors.Year[0]);
                    }
                    throw new Error(errorJson.title || errorText);
                } catch {
                    // Якщо це не JSON, просто показуємо текст
                    throw new Error(errorText || "Помилка при створенні сезону");
                }
            }

            onSeasonAdded();
            toast.success(`Сезон ${year} успішно додано!`);

        } catch (e) {
            toast.error(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // 1. Повноекранний фон, як у Login
        <div className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col justify-center items-center p-4">

            {/* 2. Картка форми (max-w-md, бо форма проста) */}
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">

                {/* 3. Заголовок */}
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">
                    Додати новий сезон
                </h2>

                {/* 4. Форма */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div>
                        <label htmlFor="season-year" className="block text-sm font-medium text-zinc-400 mb-2">
                            Рік сезону
                        </label>
                        <input
                            type="number"
                            id="season-year"
                            placeholder="Наприклад, 2025"
                            className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min="1950"
                            max="2100" // Або актуальний рік + 1
                            required
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
                            {isSubmitting ? 'Створення...' : 'Створити сезон'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSeasonForm;