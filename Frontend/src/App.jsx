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

export default function App() {
    const [seasons, setSeasons] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedRace, setSelectedRace] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isViewingDashboard, setIsViewingDashboard] = useState(false);
    const [isAddingSeason, setIsAddingSeason] = useState(false);
    const [isAddingRace, setIsAddingRace] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(0);
    const [isAddingDriver, setIsAddingDriver] = useState(false);
    const [isAddingTeam, setIsAddingTeam] = useState(false);

    useEffect(() => {

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
                    setToken("auth");
                } else if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    setToken(null);
                }
            } catch (e) {
                console.error("Auth check failed", e);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        const fetchSeasons = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/api/seasons`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSeasons(data);
                } else {
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

        if (!token) {
            checkAuthStatus();
        } else {
            fetchSeasons();
        }
    }, [token, fetchTrigger]);

    useEffect(() => {
        if (selectedSeason && seasons) {
            const updatedSelectedSeason = seasons.find(s => s.id === selectedSeason.id);
            if (updatedSelectedSeason) {
                setSelectedSeason(updatedSelectedSeason);
            }
        }
    }, [seasons]);

    function handleDriverAdded() {
        setIsAddingDriver(false);
        setFetchTrigger(p => p + 1);
    }

    function handleTeamAdded() {
        setIsAddingTeam(false);
        setFetchTrigger(prev => prev + 1);
    }

    function handleRaceAdded() {
        setIsAddingRace(false);
        setFetchTrigger(p => p + 1);
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
                const updatedSeason = {
                    ...selectedSeason,
                    races: selectedSeason.races.filter(r => r.id !== raceId)
                };
                setSelectedSeason(updatedSeason);
                setSeasons(prevSeasons =>
                    prevSeasons.map(s => s.id === seasonId ? updatedSeason : s)
                );

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
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const updatedSeason = {
                    ...selectedSeason,
                    teams: selectedSeason.teams.filter(t => t.id !== teamId)
                };

                setSelectedSeason(updatedSeason);
                setSeasons(prevSeasons =>
                    prevSeasons.map(s => s.id === seasonId ? updatedSeason : s)
                );

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
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedTeams = selectedSeason.teams.map(team => {
                    if (team.id !== teamId) return team; // Не чіпаємо чужі команди
                    return {
                        ...team,
                        drivers: team.drivers.filter(d => d.id !== driverId) // Видаляємо пілота
                    };
                });

                const updatedSeason = { ...selectedSeason, teams: updatedTeams };

                setSelectedSeason(updatedSeason);
                setSeasons(prevSeasons =>
                    prevSeasons.map(s => s.id === selectedSeason.id ? updatedSeason : s)
                );

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
                localStorage.setItem('userName', data.name || data.email)
                setToken("auth");
                setError(null);
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Помилка входу");
            }
        } catch (e) {
            toast.error("Не вдалося з'єднатися з сервером");
        }
    };

    const logout = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            await fetch(`${API_BASE_URL}/api/users/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (e) {
            console.warn('Logout request failed (this is often okay)', e);
        } finally {
            setToken(null);
            setSeasons(null);
            setSelectedSeason(null);
            setSelectedRace(null);
            setIsViewingDashboard(false);
            setIsAddingSeason(false);
            setIsAddingRace(false);

            toast('Ви вийшли з акаунту');
        }
    }, [API_BASE_URL]);

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

    if (isCheckingAuth) {
        return <AppStateScreen message="Перевірка сесії..."/>;
    }

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
            onAddTeamClick={() => setIsAddingTeam(true)}
        />
    }

    if (isAddingRace && selectedSeason) {
        return <AddRaceForm
            onRaceAdded={handleRaceAdded}
            onCancel={() => setIsAddingRace(false)}
            API_BASE_URL={API_BASE_URL}
            seasonId={selectedSeason.id}
            seasonYear={selectedSeason.year}
        />;
    }

    if (isAddingSeason) {
        return <AddSeasonForm
            onSeasonAdded={handleSeasonAdded}
            onCancel={() => setIsAddingSeason(false)}
            API_BASE_URL={API_BASE_URL}
        />;
    }

    if (!seasons) {
        return <AppStateScreen message="Завантаження сезонів..."/>;
    }

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
                    onLogout={logout}
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
}