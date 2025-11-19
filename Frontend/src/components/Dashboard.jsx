import React, { useState, useEffect } from "react";

// (API_BASE_URL та логіка хуків залишаються без змін)
const API_BASE_URL = 'https://f1-journal.onrender.com';

function Dashboard() {
    const [dashboardResponse, setDashboardResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Починаємо з true
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');

            try {
                console.log("Запускаю fetch запит до API /dashboard...");
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
                console.log("Дані кабінету успішно отримані:", data);
                setDashboardResponse(data);
                setError(null);
            } catch (e) {
                console.error("Помилка під час fetch-запиту:", e);
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // --- ОНОВЛЕНІ СТАНИ ЗАВАНТАЖЕННЯ ТА ПОМИЛОК ---

    if (isLoading) {
        return (
            // Використовуємо той самий стиль, що й в App.jsx
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-zinc-700 border-t-red-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-zinc-400 text-lg animate-pulse">Завантаження вашого кабінету...</p>
            </div>
        );
    }

    if (error) {
        return (
            // Стиль помилки з App.jsx
            <div className="bg-zinc-800 p-8 rounded-xl shadow-2xl border border-red-600/30 max-w-md w-full mx-auto text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Ой, сталася помилка!</h1>
                <p className="text-zinc-300 text-lg">{error}</p>
            </div>
        );
    }

    // --- ОНОВЛЕНИЙ ГОЛОВНИЙ RETURN ---

    // Перевіряємо, чи є дані. Якщо ні - показуємо гарний "пустий" стан
    const isEmpty = !dashboardResponse ||
        (dashboardResponse.raceReviews.length === 0 &&
            dashboardResponse.driverPerformanceReviews.length === 0 &&
            dashboardResponse.teamPerformanceReviews.length === 0);

    return (
        // Контейнер успадковує 'max-w-7xl' від App.jsx
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-8">
                Ваш Кабінет
            </h1>

            {/* Якщо всі списки порожні, показуємо "пустий" стан */}
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
                // Якщо дані є, рендеримо секції
                <div className="flex flex-col gap-10">

                    {/* Секція: Відгуки на гонки */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b border-zinc-700 pb-3">
                            Відгуки на гонки ({dashboardResponse?.raceReviews?.length || 0})
                        </h2>
                        {dashboardResponse?.raceReviews?.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {dashboardResponse.raceReviews.map(review => (
                                    <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-red-600">{review.mark}</span>
                                            <span className="text-zinc-400">/ 10</span>
                                        </div>
                                        <p className="text-lg text-gray-100 mt-3">"{review.description}"</p>
                                        <p className="text-xs text-zinc-500 mt-4 opacity-75">Гонка: {review.raceName}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-zinc-400">Ви ще не залишили жодного відгуку на гонку.</p>}
                    </section>

                    {/* Секція: Відгуки на пілотів */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b border-zinc-700 pb-3">
                            Відгуки на пілотів ({dashboardResponse?.driverPerformanceReviews?.length || 0})
                        </h2>
                        {dashboardResponse?.driverPerformanceReviews?.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {dashboardResponse.driverPerformanceReviews.map(review => (
                                    <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-red-600">{review.mark}</span>
                                            <span className="text-zinc-400">/ 10</span>
                                        </div>
                                        <p className="text-lg text-gray-100 mt-3">"{review.description}"</p>
                                        <p className="text-xs text-zinc-500 mt-4 opacity-75">Пілот: {review.driverName}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-zinc-400">Ви ще не оцінювали пілотів.</p>}
                    </section>

                    {/* Секція: Відгуки на команди */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b border-zinc-700 pb-3">
                            Відгуки на команди ({dashboardResponse?.teamPerformanceReviews?.length || 0})
                        </h2>
                        {dashboardResponse?.teamPerformanceReviews?.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {dashboardResponse.teamPerformanceReviews.map(review => (
                                    <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-red-600">{review.mark}</span>
                                            <span className="text-zinc-400">/ 10</span>
                                        </div>
                                        <p className="text-lg text-gray-100 mt-3">"{review.description}"</p>
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