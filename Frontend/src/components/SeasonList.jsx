import React from "react";


// Приймаємо ті ж самі пропси
function SeasonList({ seasons, onSeasonClick, onAddSeasonClick, onDeleteSeasonClick }) {

    // Якщо сезонів немає, показуємо гарне повідомлення
    if (!seasons || seasons.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-gray-100 mb-4">
                    Ваш Журнал порожній
                </h2>
                <p className="text-lg text-zinc-400 mb-8">
                    Здається, ви ще не додали жодного сезону.
                </p>
                <button
                    onClick={onAddSeasonClick}
                    className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                >
                    + Додати перший сезон
                </button>
            </div>
        );
    }

    // Якщо сезони є, показуємо їх
    return (
        <>
            {/* 1. Рядок заголовка та кнопки "Додати" */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">
                    Оберіть сезон:
                </h2>

                {/* 2. Кнопка "Додати" у нашому фірмовому стилі */}
                <button
                    onClick={onAddSeasonClick}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                    + Додати сезон
                </button>
            </div>

            {/* 3. Адаптивна сітка для карток сезонів */}
            {/* - 1 колонка на мобільних
                   - 2 колонки на середніх екранах (md)
                   - 3 колонки на великих екранах (lg)
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {seasons.map((season) => (
                    <div
                        key={season.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg
                   p-6
                   cursor-pointer
                   transition-all duration-300
                   group                   // <--- Додаємо 'group'
                   hover:bg-zinc-800
                   hover:border-red-600/50"
                        onClick={() => onSeasonClick(season)}
                    >
                        <div className="flex justify-between items-start">
                            {/* Блок з інформацією */}
                            <div>
                                <h3 className="text-3xl font-bold text-gray-100 mb-1 group-hover:text-white">
                                    {season.year}
                                </h3>
                                <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300">
                                    {season.races.length} {getRaceWord(season.races.length)}
                                </p>
                            </div>

                            {/* ❗️ ОНОВЛЕНА КНОПКА ВИДАЛЕННЯ ❗️ */}
                            <button
                                className="py-1 px-3
                           bg-zinc-800 text-zinc-400 text-xs font-semibold rounded-full
                           border border-zinc-700
                           opacity-0 group-hover:opacity-100 // <--- З'являється при наведенні
                           transition-all duration-300
                           hover:!opacity-100 hover:bg-red-600 hover:text-white hover:border-red-500"
                                onClick={(e) => {
                                    e.stopPropagation(); // Це ти вже знаєш, молодець!
                                    onDeleteSeasonClick(season.id); // Потрібно буде створити цю функцію в App.jsx
                                }}
                            >
                                Видалити
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

// Маленька допоміжна функція для правильних закінчень (можна винести)
function getRaceWord(count) {
    if (count === 1) return "гонка";
    if (count > 1 && count < 5) return "гонки";
    return "гонок";
}

export default SeasonList;