import React, { useState, useEffect } from "react";

const API_BASE_URL = 'https://f1-journal.onrender.com';

function Dashboard() {
    const [dashboardResponse, setDashboardResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 401) {
                throw new Error("Не авторизовано. Спробуйте увійти знову.");
            }
            if (!response.ok) {
                throw new Error(`Помилка HTTP! Статус: ${response.status}`);
            }

            const data = await response.json();
            setDashboardResponse(data);
            setError(null);
        } catch (e) {
            console.error("Помилка під час fetch-запиту:", e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Логіка видалення ---
    const handleDeleteReview = async (reviewId, type) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей відгук?")) {
            return;
        }

        const token = localStorage.getItem('authToken');

        // УВАГА: Тут припускається, що ваш контролер має маршрут "api/reviews"
        // Якщо методи видалення знаходяться в "api/dashboard", змініть цей рядок.
        const controllerPrefix = '/api/reviews';

        // Визначаємо правильний URL залежно від типу
        let endpoint = '';
        if (type === 'race') endpoint = `${controllerPrefix}/race/${reviewId}`;
        else if (type === 'driver') endpoint = `${controllerPrefix}/driver/${reviewId}`;
        else if (type === 'team') endpoint = `${controllerPrefix}/team/${reviewId}`;

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("Не вдалося видалити відгук");
            }

            // Оновлюємо стейт локально, щоб не робити зайвий запит на сервер
            setDashboardResponse(prevState => {
                const newState = { ...prevState };

                if (type === 'race') {
                    newState.raceReviews = prevState.raceReviews.filter(r => r.id !== reviewId);
                } else if (type === 'driver') {
                    newState.driverPerformanceReviews = prevState.driverPerformanceReviews.filter(r => r.id !== reviewId);
                } else if (type === 'team') {
                    newState.teamPerformanceReviews = prevState.teamPerformanceReviews.filter(r => r.id !== reviewId);
                }

                return newState;
            });

        } catch (error) {
            alert("Помилка видалення: " + error.message);
        }
    };

    // Компонент кнопки видалення (для чистоти коду)
    const DeleteButton = ({ id, type }) => (
        <button
            onClick={() => handleDeleteReview(id, type)}
            className="text-zinc-600 hover:text-red-500 transition-colors p-1 rounded hover:bg-zinc-800"
            title="Видалити відгук"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456-1.22L17.56 2.66a1.75 1.75 0 0 0-1.764-1.058H8.844a1.75 1.75 0 0 0-1.764 1.058L6.32 4.57m13.633 1.12-1.032.198M6.32 4.57l-1.032.198" />
            </svg>
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-zinc-700 border-t-red-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-zinc-400 text-lg animate-pulse">Завантаження вашого кабінету...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-zinc-800 p-8 rounded-xl shadow-2xl border border-red-600/30 max-w-md w-full mx-auto text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Ой, сталася помилка!</h1>
                <p className="text-zinc-300 text-lg">{error}</p>
            </div>
        );
    }

    const isEmpty = !dashboardResponse ||
        (dashboardResponse.raceReviews.length === 0 &&
            dashboardResponse.driverPerformanceReviews.length === 0 &&
            dashboardResponse.teamPerformanceReviews.length === 0);

    return (
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-8">
                Ваш Кабінет
            </h1>

            {isEmpty ? (
                <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl">
                    <h3 className="text-2xl font-bold text-gray-100 mb-3">
                        Тут поки що порожньо
                    </h3>
                    <p className="text-lg text-zinc-400">
                        Схоже, ви ще не залишили жодного відгуку.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-10">

                    {/* RACE REVIEWS */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b border-zinc-700 pb-3">
                            Відгуки на гонки ({dashboardResponse?.raceReviews?.length || 0})
                        </h2>
                        {dashboardResponse?.raceReviews?.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {dashboardResponse.raceReviews.map(review => (
                                    <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-red-600">{review.mark}</span>
                                                <span className="text-zinc-400">/ 10</span>
                                            </div>
                                            <DeleteButton id={review.id} type="race" />
                                        </div>
                                        <p className="text-lg text-gray-100 mt-1">"{review.description}"</p>
                                        <p className="text-xs text-zinc-500 mt-4 opacity-75">Гонка: {review.raceName}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-zinc-400">Ви ще не залишили жодного відгуку на гонку.</p>}
                    </section>

                    {/* DRIVER REVIEWS */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b border-zinc-700 pb-3">
                            Відгуки на пілотів ({dashboardResponse?.driverPerformanceReviews?.length || 0})
                        </h2>
                        {dashboardResponse?.driverPerformanceReviews?.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {dashboardResponse.driverPerformanceReviews.map(review => (
                                    <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-red-600">{review.mark}</span>
                                                <span className="text-zinc-400">/ 10</span>
                                            </div>
                                            <DeleteButton id={review.id} type="driver" />
                                        </div>
                                        <p className="text-lg text-gray-100 mt-1">"{review.description}"</p>
                                        <p className="text-xs text-zinc-500 mt-4 opacity-75">Пілот: {review.driverName}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-zinc-400">Ви ще не оцінювали пілотів.</p>}
                    </section>

                    {/* TEAM REVIEWS */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b border-zinc-700 pb-3">
                            Відгуки на команди ({dashboardResponse?.teamPerformanceReviews?.length || 0})
                        </h2>
                        {dashboardResponse?.teamPerformanceReviews?.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {dashboardResponse.teamPerformanceReviews.map(review => (
                                    <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-red-600">{review.mark}</span>
                                                <span className="text-zinc-400">/ 10</span>
                                            </div>
                                            <DeleteButton id={review.id} type="team" />
                                        </div>
                                        <p className="text-lg text-gray-100 mt-1">"{review.description}"</p>
                                        <p className="text-xs text-zinc-500 mt-4 opacity-75">Команда: {review.teamName}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-zinc-400">Ви ще не оцінювали команди.</p>}
                    </section>
                </div>
            )}
        </div>
    );
}

export default Dashboard;