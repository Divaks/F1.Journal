import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import SeasonList from './components/SeasonList.jsx';
import RaceList from './components/RaceList.jsx';
import ReviewPage from './components/ReviewPage.jsx';
import Login from './components/Login.jsx';
import Register from "./components/Register.jsx";
import Dashboard from './components/Dashboard.jsx';
import AddSeasonForm from './components/AddSeasonForm.jsx';
import AddRaceForm from './components/AddRaceForm.jsx';
import AddTeamForm from './components/AddTeamForm.jsx';
import AddDriverForm from "./components/AddDriverForm.jsx";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://f1-journal.onrender.com';

// --- Компонент-обгортка для тостера ---
const AppToaster = () => (
    <Toaster
        position="bottom-right"
        toastOptions={{
            style: {
                background: '#27272a', // bg-zinc-800
                color: '#e4e4e7', // text-zinc-200
                border: '1px solid #3f3f46', // border-zinc-700
            },
            success: {
                iconTheme: { primary: '#ef4444', secondary: '#e4e4e7' },
            },
            error: {
                iconTheme: { primary: '#ef4444', secondary: '#e4e4e7' },
            }
        }}
    />
);

// --- Компонент-обгортка для станів завантаження/помилок ---
// (Я зберіг твій renderLoading та екран помилки тут)
const AppStateScreen = ({ message, isError = false, onRetry }) => (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        {isError ? (
            <div className="bg-zinc-800 p-8 rounded-xl shadow-2xl border border-red-600/30 max-w-md w-full">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Ой, сталася помилка!</h1>
                <p className="text-zinc-300 text-lg mb-6">{message}</p>
                <button
                    onClick={onRetry || (() => window.location.reload())}
                    className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
                >
                    Оновити сторінку
                </button>
            </div>
        ) : (
            <>
                <div className="w-10 h-10 border-4 border-zinc-700 border-t-red-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-zinc-400 text-lg animate-pulse">{message}</p>
            </>
        )}
    </div>
);


// --- ГОЛОВНИЙ КОМПОНЕНТ ---
export default function App() {

    // --- СТАНИ ---
    const [seasons, setSeasons] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedRace, setSelectedRace] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // <--- Наш "воротар"
    const [isRegistering, setIsRegistering] = useState(false);
    const [isViewingDashboard, setIsViewingDashboard] = useState(false);
    const [isAddingSeason, setIsAddingSeason] = useState(false);
    const [isAddingRace, setIsAddingRace] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(0);
    const [isAddingDriver, setIsAddingDriver] = useState(false);
    const [isAddingTeam, setIsAddingTeam] = useState(false);

    // --- ЛОГІКА: АВТЕНТИФІКАЦІЯ ТА ЗАВАНТАЖЕННЯ ДАНИХ ---

    // ❗️❗️❗️ ОСЬ ВИПРАВЛЕНИЙ USEEFFECT ❗️❗️❗️
    // Ми об'єднуємо ВСЮ логіку завантаження в один хук,
    // щоб гарантувати правильну послідовність
    useEffect(() => {

        // --- ФУНКЦІЯ 1: Перевірка сесії ---
        const checkAuthStatus = async () => {
            setIsCheckingAuth(true);
            const token = localStorage.getItem('authToken');

            if (!token) {
                setIsCheckingAuth(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/users/check-auth`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('authToken', data.token);
                    setToken("auth"); // Успіх!
                } else if (response.status === 401) {
                    // Якщо токен прострочений або недійсний
                    localStorage.removeItem('authToken');
                    setToken(null);
                }
            } catch (e) {
                console.error("Auth check failed", e);
                // setToken(null) тут не потрібен, бо він і так null
            } finally {
                setIsCheckingAuth(false); // Завершуємо перевірку
            }
        };

        // --- ФУНКЦІЯ 2: Завантаження сезонів ---
        const fetchSeasons = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/api/seasons`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // ❗️ ВИПРАВЛЕНА ЛОГІКА ОБРОБКИ ❗️
                if (response.ok) {
                    const data = await response.json();
                    setSeasons(data);
                } else {
                    // Обробляємо помилки, ТІЛЬКИ ЯКЩО response НЕ ok
                    if (response.status === 401) {
                        setToken(null);
                        setError("Сесія застаріла, увійдіть знову.");
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (e) {
                setError(e.message);
            }
        };

        // --- ГОЛОВНА ЛОГІКА ЦЬОГО USEEFFECT ---
        if (!token) {
            // Якщо токен не встановлений, єдине, що ми робимо - перевіряємо сесію
            checkAuthStatus();
        } else {
            // Якщо токен ВЖЕ є (з checkAuthStatus або після логіну),
            // ми завантажуємо сезони
            fetchSeasons();
        }
    }, [token, fetchTrigger]); // Залежимо від 'token' та 'fetchTrigger'


    // --- ІНШІ ФУНКЦІЇ-ОБРОБНИКИ (без змін) ---
    function handleDriverAdded() {
        setIsAddingDriver(false);
        setSelectedSeason(null);
        setFetchTrigger(p => p + 1);
    }

    function handleTeamAdded() {
        setIsAddingTeam(false);
        setFetchTrigger(prev => prev + 1);
        setSelectedSeason(null);
    }

    function handleRaceAdded() {
        setIsAddingRace(false);
        setSelectedSeason(null);
        setFetchTrigger(p => p + 1); // <--- Додав тригер на випадок, якщо setSelectedSeason(null) не спрацює
    }

    function handleSeasonAdded() {
        setIsAddingSeason(false);
        setFetchTrigger(p => p + 1);
    }

    const handleDeleteRace = async (seasonId, raceId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю гонку? ...")) return;
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/seasons/${seasonId}/races/${raceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                if (selectedSeason && selectedSeason.races) {
                    const updatedRaces = selectedSeason.races.filter(r => r.id !== raceId);
                    const updatedSeason = {...selectedSeason, races: updatedRaces};
                    setSelectedSeason(updatedSeason);
                }
                toast.success(`Гонка успішно видалена.`);
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Помилка видалення");
            }
        } catch (e) {
            toast.error("Помилка мережі при видаленні.");
        }
    };

    const handleDeleteTeam = async (seasonId, teamId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю команду? ...")) return;
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/seasons/${seasonId}/teams/${teamId}`, {
                method: 'DELETE',
                headers: {
                    // 2. Додати заголовок авторизації
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                if (selectedSeason && selectedSeason.teams) {
                    const updatedTeams = selectedSeason.teams.filter(t => t.id !== teamId);
                    const updatedSeason = {...selectedSeason, teams: updatedTeams};
                    setSelectedSeason(updatedSeason);
                }
                toast.success(`Команда успішно видалена.`);
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Помилка видалення");
            }
        } catch (e) {
            toast.error("Помилка мережі при видаленні.");
        }
    };

    const handleDeleteDriver = async (teamId, driverId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цього пілота? ...")) return;

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/drivers/${driverId}`, {
                method: 'DELETE',
                headers: {
                    // 2. Додати заголовок авторизації
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setFetchTrigger(p => p + 1);
                if (selectedTeam && selectedTeam.drivers) {
                    const updatedDrivers = selectedTeam.drivers.filter(t => t.id !== driverId);
                    const updatedTeam = {...selectedTeam, teams: updatedDrivers};
                    setSelectedSeason(updatedTeam);
                }

                toast.success('Пілот успішно видалений.');
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Помилка видалення");
            }
        } catch (e) {
            toast.error("Помилка мережі при видаленні.");
        }
    };

    const handleDeleteSeason = async (seasonId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей сезон? ...")) return;
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/seasons/${seasonId}`, {
                method: 'DELETE',
                headers: {
                    // 2. Додати заголовок авторизації
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setSeasons(currentSeasons => currentSeasons.filter(s => s.id !== seasonId));
                if (selectedSeason && selectedSeason.id === seasonId) setSelectedSeason(null);
                toast.success(`Сезон успішно видалений.`);
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Помилка видалення");
            }
        } catch (e) {
            toast.error("Помилка мережі при видаленні.");
        }
    };

    function handleSeasonClick(season) {
        setSelectedSeason(season);
    }

    function handleRaceClick(race) {
        setSelectedRace(race);
    }

    function handleBackToSeasons() {
        setSelectedSeason(null);
    }

    function handleBackToRaces() {
        setSelectedRace(null);
    }

    function handleReviewSubmitted() {
        setSelectedRace(null);
    }

    const login = async (emailData, passwordData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: emailData, password: passwordData})
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                setToken("auth");
                setError(null);
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Помилка входу"); // <--- Використовуємо toast
            }
        } catch (e) {
            toast.error("Не вдалося з'єднатися з сервером"); // <--- Використовуємо toast
        }
    };

    const logout = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            // 1. Викликаємо C# ендпоінт, щоб він видалив HttpOnly куку
            await fetch(`${API_BASE_URL}/api/users/logout`, {
                method: 'POST',
                headers: {
                    // 2. Додати заголовок авторизації
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (e) {
            console.warn('Logout request failed (this is often okay)', e);
        } finally {
            // 2. Незалежно від успіху, скидаємо ВЕСЬ стан React
            setToken(null);
            setSeasons(null);
            setSelectedSeason(null);
            setSelectedRace(null);
            setIsViewingDashboard(false);
            setIsAddingSeason(false);
            setIsAddingRace(false);

            // 3. Повідомляємо користувача
            toast('Ви вийшли з акаунту');
        }
    }, [API_BASE_URL]);

    // ----------------------------
    // --- РЕНДЕРИНГ (ВИГЛЯД) ---
    // ----------------------------

    // 1. Помилка
    if (error) {
        return (
            <>
                <AppToaster/>
                <AppStateScreen
                    isError={true}
                    message={error}
                    onRetry={() => {
                        setError(null);
                        setFetchTrigger(p => p + 1);
                    }}
                />
            </>
        );
    }

    // 2. "Воротар" - Перевірка сесії
    if (isCheckingAuth) {
        return <AppStateScreen message="Перевірка сесії..."/>;
    }

    // 3. Не залогінений
    if (!token) {
        return (
            <>
                <AppToaster/>
                {isRegistering ? (
                    <Register onSwitchToLogin={() => setIsRegistering(false)}/>
                ) : (
                    <Login onLogin={login} onSwitchToRegister={() => setIsRegistering(true)}/>
                )}
            </>
        );
    }

    // --- ЗАЛОГІНЕНИЙ КОРИСТУВАЧ ---

    // 4. Форми-модалки (мають вищий пріоритет)
    if (isAddingSeason) {
        return <AddSeasonForm
            onSeasonAdded={handleSeasonAdded}
            onCancel={() => setIsAddingSeason(false)}
            API_BASE_URL={API_BASE_URL}
        />;
    }

    if (isAddingRace && selectedSeason) {
        return <AddRaceForm
            onRaceAdded={handleRaceAdded}
            onCancel={() => setIsAddingRace(false)}
            API_BASE_URL={API_BASE_URL}
            seasonId={selectedSeason.id}
        />;
    }

    if (isAddingTeam && selectedSeason && selectedSeason.id) {
        return <AddTeamForm
            onTeamAdded={handleTeamAdded}
            onCancel={() => setIsAddingTeam(false)}
            API_BASE_URL={API_BASE_URL}
            seasonId={selectedSeason.id}
        />
    }

    if (isAddingDriver && selectedSeason) {
        return <AddDriverForm
            onDriverAdded={handleDriverAdded}
            onCancel={() => setIsAddingDriver(false)}
            API_BASE_URL={API_BASE_URL}
            seasonId={selectedSeason.id}
        />
    }

    if (isAddingDriver && selectedSeason && !selectedTeam) {
        return <AddTeamForm
            onTeamAdded={handleTeamAdded}
            onCancel={() => setIsAddingTeam(false)}
            API_BASE_URL={API_BASE_URL}
            seasonId={selectedSeason.id}
        />
    }

    // 5. Завантаження даних (якщо токен є, але сезонів ще немає)
    if (!seasons) {
        return <AppStateScreen message="Завантаження сезонів..."/>;
    }

    // 6. ГОЛОВНИЙ ЕКРАН (Все завантажено)
    return (
        <>
            <AppToaster/>
            <div className="min-h-screen bg-zinc-950 text-gray-100">
                <Navbar
                    onViewDashboard={() => {
                        setIsViewingDashboard(true);
                        setSelectedSeason(null);
                        setSelectedRace(null);
                    }}
                    onViewSeasons={() => {
                        setIsViewingDashboard(false);
                        setSelectedSeason(null);
                        setSelectedRace(null);
                    }}
                    onLogout={logout} // <--- Тобі потрібно буде передати сюди 'logout'
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                    {isViewingDashboard ? (
                        <Dashboard/>
                    ) : (
                        selectedSeason === null
                            ? <SeasonList
                                seasons={seasons}
                                onSeasonClick={handleSeasonClick}
                                onAddSeasonClick={() => setIsAddingSeason(true)}
                                onDeleteSeasonClick={handleDeleteSeason}
                            />
                            : selectedRace === null
                                ? <RaceList
                                    season={selectedSeason}
                                    onBackList={handleBackToSeasons}
                                    onRaceClick={handleRaceClick}
                                    onAddRaceClick={() => setIsAddingRace(true)}
                                    onDeleteRaceClick={handleDeleteRace}
                                    onAddTeamClick={() => setIsAddingTeam(true)}
                                    onDeleteTeamClick={handleDeleteTeam}
                                    onAddDriverClick={() => setIsAddingDriver(true)}
                                    onDeleteDriverClick={handleDeleteDriver}
                                />
                                : <ReviewPage
                                    race={selectedRace}
                                    onBackToRaces={handleBackToRaces}
                                    onReviewSubmit={handleReviewSubmitted}
                                />
                    )}
                </main>
            </div>
        </>
    );
};