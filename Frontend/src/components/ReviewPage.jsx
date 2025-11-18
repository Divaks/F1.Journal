import React, { useState } from 'react';
import RaceReviewForm from './RaceReviewForm.jsx'; // <--- Нам знадобиться цей файл
import DriverReviewForm from './DriverReviewForm.jsx'; // <--- і цей
import TeamReviewForm from './TeamReviewForm.jsx'; // <--- і цей

// Та сама допоміжна функція для дати
const formatDate = (dateString) => {
    if (!dateString) return "---";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString("uk-UA", options);
};

// 'race', 'onBackToRaces', 'onReviewSubmit' - ті ж самі пропси
// ❗️ ВАЖЛИВО: Ми припускаємо, що 'race' тепер містить 'seasonId'
function ReviewPage({ race, onBackToRaces, onReviewSubmit }) {

    // НОВИЙ СТАН: Керує тим, яка вкладка/форма активна
    const [activeTab, setActiveTab] = useState('race'); // 'race', 'drivers', 'teams'

    // Функція для стилізації активної вкладки
    const getTabClass = (tabName) => {
        return activeTab === tabName
            ? "border-b-2 border-red-600 text-gray-100" // Активна вкладка
            : "border-transparent text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"; // Неактивна
    };

    return (
        // Контейнер з обмеженням ширини (max-w-4xl, бо контенту буде більше)
        <div className="max-w-4xl mx-auto">

            {/* 1. Кнопка "Назад" (той самий стиль) */}
            <button
                className="mb-6 text-zinc-400 font-medium hover:text-white transition-colors"
                onClick={onBackToRaces}
            >
                &larr; Назад до списку гонок
            </button>

            {/* 2. Заголовок (той самий стиль) */}
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
                {race.name}
            </h1>
            <p className="text-xl text-zinc-400 mb-8">
                {formatDate(race.raceDate)}
            </p>

            {/* 3. НОВА НАВІГАЦІЯ ПО ВКЛАДКАХ */}
            <div className="border-b border-zinc-800 mb-8">
                <nav className="flex gap-6 sm:gap-8 -mb-px">
                    <button
                        className={`py-4 px-1 text-base sm:text-lg font-semibold transition-colors ${getTabClass('race')}`}
                        onClick={() => setActiveTab('race')}
                    >
                        Відгук на Гонку
                    </button>
                    <button
                        className={`py-4 px-1 text-base sm:text-lg font-semibold transition-colors ${getTabClass('drivers')}`}
                        onClick={() => setActiveTab('drivers')}
                    >
                        Оцінки Пілотів
                    </button>
                    <button
                        className={`py-4 px-1 text-base sm:text-lg font-semibold transition-colors ${getTabClass('teams')}`}
                        onClick={() => setActiveTab('teams')}
                    >
                        Оцінки Команд
                    </button>
                </nav>
            </div>

            {/* 4. УМОВНИЙ РЕНДЕРИНГ ФОРМ */}
            <div>
                {activeTab === 'race' && (
                    <RaceReviewForm
                        raceId={race.id}
                        onReviewSubmit={onReviewSubmit}
                    />
                )}

                {activeTab === 'drivers' && (
                    <DriverReviewForm
                        raceId={race.id}
                        seasonId={race.seasonId} // <--- ❗️ ВАЖЛИВО! Передаємо ID сезону
                        onReviewSubmit={onReviewSubmit}
                    />
                )}

                {activeTab === 'teams' && (
                    <TeamReviewForm
                        raceId={race.id}
                        seasonId={race.seasonId} // <--- ❗️ ВАЖЛИВО! Передаємо ID сезону
                        onReviewSubmit={onReviewSubmit}
                    />
                )}
            </div>
        </div>
    );
}

export default ReviewPage;