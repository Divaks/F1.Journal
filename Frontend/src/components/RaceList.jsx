import React, { useState } from 'react';

// Та сама допоміжна функція для дати
const formatDate = (dateString) => {
    if (!dateString) return "---";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString("uk-UA", options);
};

// ❗️ КОМПОНЕНТ ТЕПЕР ПРИЙМАЄ НОВІ ПРОПСИ
function RaceList({
                      season,
                      onBackList,
                      onRaceClick,
                      onAddRaceClick,
                      onDeleteRaceClick,
                      onAddTeamClick,     // <--- НОВИЙ ПРОП
                      onDeleteTeamClick,  // <--- НОВИЙ ПРОП
                      onAddDriverClick,   // <--- НОВИЙ ПРОП
                      onDeleteDriverClick
                      // <--- НОВИЙ ПРОП
                  }) {

    // НОВИЙ СТАН: Керує тим, яка вкладка активна
    const [activeTab, setActiveTab] = useState('races'); // 'races', 'teams', 'drivers'

    // Функція для стилізації активної вкладки
    const getTabClass = (tabName) => {
        return activeTab === tabName
            ? "border-b-2 border-red-600 text-gray-100" // Активна
            : "border-transparent text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"; // Неактивна
    };

    // Отримуємо всіх пілотів з усіх команд (для вкладки "Пілоти")
    const allDrivers = season.teams?.flatMap(team =>
        team.drivers.map(driver => ({ ...driver, teamId: team.id }))
    ) || [];

    return (
        <>
            {/* 1. Блок заголовка (без змін) */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBackList}
                        className="text-zinc-400 font-medium hover:text-white transition-colors"
                    >
                        &larr; Назад до сезонів
                    </button>
                    <span className="w-px h-6 bg-zinc-700 hidden sm:block"></span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-100">
                        {season.year}
                    </h2>
                </div>
            </div>

            {/* 2. НОВА НАВІГАЦІЯ ПО ВКЛАДКАХ */}
            <div className="border-b border-zinc-800 mb-8">
                <nav className="flex gap-6 sm:gap-8 -mb-px">
                    <button
                        className={`py-4 px-1 text-base sm:text-lg font-semibold transition-colors ${getTabClass('races')}`}
                        onClick={() => setActiveTab('races')}
                    >
                        Гонки ({season.races?.length || 0})
                    </button>
                    <button
                        className={`py-4 px-1 text-base sm:text-lg font-semibold transition-colors ${getTabClass('teams')}`}
                        onClick={() => setActiveTab('teams')}
                    >
                        Команди ({season.teams?.length || 0})
                    </button>
                    <button
                        className={`py-4 px-1 text-base sm:text-lg font-semibold transition-colors ${getTabClass('drivers')}`}
                        onClick={() => setActiveTab('drivers')}
                    >
                        Пілоти ({allDrivers.length || 0})
                    </button>
                </nav>
            </div>

            {/* 3. УМОВНИЙ РЕНДЕРИНГ КОНТЕНТУ ВКЛАДОК */}

            {/* ---------- ВКЛАДКА "ГОНКИ" ---------- */}
            {activeTab === 'races' && (
                <section>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={onAddRaceClick}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all"
                        >
                            + Додати гонку
                        </button>
                    </div>
                    {(!season.races || season.races.length === 0) ? (
                        <div className="text-center py-16 border-2 border-dashed border-zinc-700/50 rounded-xl bg-zinc-900/50">

                            <div className="text-6xl text-zinc-600 mb-4" aria-hidden="true">
                                🛠️
                            </div>

                            <h3 className="text-3xl font-bold text-gray-100 mb-3">
                                У цьому сезоні ще немає гонок
                            </h3>

                            <p className="text-lg text-zinc-400 mb-8">
                                Створіть гонку, аби робити відгуки
                            </p>

                            {/* Кнопка Call-to-Action (CTA) */}
                            <button
                                onClick={onAddRaceClick} // <-- Припускаємо, що цей проп існує
                                className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-500"
                            >
                                + Створити першу гонку
                            </button>
                        </div>                     ) : (
                        <div className="flex flex-col gap-4">
                            {season.races.map((race) => (
                                <div key={race.id} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:bg-zinc-800 hover:border-red-600/50"
                                     onClick={() => onRaceClick(race)}>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-100">{race.name}</h3>
                                        <p className="text-sm text-zinc-400 mt-1">{race.circuitName}</p>
                                        <p className="text-xs text-zinc-500 mt-2">{formatDate(race.raceDate)}</p>
                                    </div>
                                    <button className="ml-4 flex-shrink-0 text-sm py-2 px-4 rounded-lg bg-red-900/40 text-red-400 border border-red-800/50 hover:bg-red-600 hover:text-white transition-all"
                                            onClick={(e) => { e.stopPropagation(); onDeleteRaceClick(season.id, race.id); }}>
                                        Видалити
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ---------- ВКЛАДКА "КОМАНДИ" ---------- */}
            {activeTab === 'teams' && (
                <section>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={onAddTeamClick} // <--- Тобі потрібно буде передати цей проп
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all"
                        >
                            + Додати команду
                        </button>
                    </div>
                    {(!season.teams || season.teams.length === 0) ? (
                        <div className="text-center py-16 border-2 border-dashed border-zinc-700/50 rounded-xl bg-zinc-900/50">

                            <div className="text-6xl text-zinc-600 mb-4" aria-hidden="true">
                                🛠️
                            </div>

                            <h3 className="text-3xl font-bold text-gray-100 mb-3">
                                У цьому сезоні ще немає команд
                            </h3>

                            <p className="text-lg text-zinc-400 mb-8">
                                Для того, щоб додати пілотів та результати, спочатку створіть команду.
                            </p>

                            {/* Кнопка Call-to-Action (CTA) */}
                            <button
                                onClick={onAddTeamClick} // <-- Припускаємо, що цей проп існує
                                className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-500"
                            >
                                + Створити першу команду
                            </button>
                        </div>                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {season.teams.map((team) => (
                                <div key={team.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-gray-100">{team.name}</h3>
                                    <p className="text-sm text-zinc-400 mt-1">База: {team.base}</p>
                                    <p className="text-sm text-zinc-400">Керівник: {team.teamPrincipal}</p>
                                    <p className="text-sm font-semibold text-zinc-200 mt-4 mb-2">Пілоти:</p>
                                    <ul className="list-disc list-inside text-zinc-400 text-sm">
                                        {team.drivers.length > 0 ? (
                                            team.drivers.map(driver => <li key={driver.id}>{driver.name} (#{driver.driverNumber})</li>)
                                        ) : <li>Пілотів не додано</li>}
                                    </ul>
                                    <button className="mt-4 text-xs text-red-400 hover:text-red-300 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); onDeleteTeamClick(season.id, team.id); /* onDeleteTeamClick(team.id); */ }}>
                                        Видалити команду
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ---------- ВКЛАДКА "ПІЛОТИ" ---------- */}
            {activeTab === 'drivers' && (
                <section>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={onAddDriverClick} // <--- Тобі потрібно буде передати цей проп
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all"
                        >
                            + Додати пілота
                        </button>
                    </div>
                    {allDrivers.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-zinc-700/50 rounded-xl bg-zinc-900/50">

                            <div className="text-6xl text-zinc-600 mb-4" aria-hidden="true">
                                🛠️
                            </div>

                            <h3 className="text-3xl font-bold text-gray-100 mb-3">
                                У цьому сезоні ще немає пілотів
                            </h3>

                            <p className="text-lg text-zinc-400 mb-8">
                                Для того, щоб додати пілотів та результати, спочатку створіть команду.
                            </p>

                            {/* Кнопка Call-to-Action (CTA) */}
                            <button
                                onClick={onAddDriverClick} // <-- Припускаємо, що цей проп існує
                                className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-500"
                            >
                                + Створити першого пілота
                            </button>
                        </div>                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allDrivers.map((driver) => (
                                <div key={driver.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-gray-100">{driver.name}</h3>
                                    <p className="text-sm text-zinc-400">#{driver.driverNumber} | {driver.nationality}</p>
                                    {/* <p className="text-sm text-zinc-500 mt-2">Команда: {driver.team.name}</p> <- Потребує складнішого масиву */}
                                    <button className="mt-4 text-xs text-red-400 hover:text-red-300 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); onDeleteDriverClick(driver.teamId, driver.id); }}>
                                        Видалити пілота
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </>
    );
}

export default RaceList;