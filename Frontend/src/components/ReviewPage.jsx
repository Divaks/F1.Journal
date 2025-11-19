import React, { useState } from 'react';
import RaceReviewForm from './RaceReviewForm.jsx';
import DriverReviewForm from './DriverReviewForm.jsx';
import TeamReviewForm from './TeamReviewForm.jsx';

const formatDate = (dateString) => {
    if (!dateString) return "---";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString("uk-UA", options);
};

function ReviewPage({ race, onBackToRaces, onReviewSubmit }) {

    const [activeTab, setActiveTab] = useState('race');

    const getTabClass = (tabName) => {
        return activeTab === tabName
            ? "border-b-2 border-red-600 text-gray-100"
            : "border-transparent text-zinc-400 hover:border-zinc-500 hover:text-zinc-200";
    };

    return (
        <div className="max-w-4xl mx-auto">

            <button
                className="mb-6 text-zinc-400 font-medium hover:text-white transition-colors"
                onClick={onBackToRaces}
            >
                &larr; Назад до списку гонок
            </button>

            <h1 className="text-4xl font-bold text-gray-100 mb-2">
                {race.name}
            </h1>
            <p className="text-xl text-zinc-400 mb-8">
                {formatDate(race.raceDate)}
            </p>

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
                        seasonId={race.seasonId}
                        onReviewSubmit={onReviewSubmit}
                    />
                )}

                {activeTab === 'teams' && (
                    <TeamReviewForm
                        raceId={race.id}
                        seasonId={race.seasonId}
                        onReviewSubmit={onReviewSubmit}
                    />
                )}
            </div>
        </div>
    );
}

export default ReviewPage;