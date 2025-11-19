import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AddDriverForm from './AddDriverForm';
import AddTeamForm from "./AddTeamForm.jsx";

// Вся твоя логіка стану та 'fetch' залишається без змін
export default function AddDriverForm({ onDriverAdded, onCancel, API_BASE_URL, seasonId }) {

    const [name, setName] = useState('');
    const [nationality, setNationality] = useState('');
    const [driverNumber, setDriverNumber] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/api/seasons/${seasonId}/teams/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setTeams(data);

                if (data.length > 0) {
                    setSelectedTeamId(data[0].id);
                }
            } catch (e) {
                console.error("Помилка завантаження команд:", e);
                toast.error("Не вдалося завантажити список команд.");
            } finally {
                setLoading(false);
            }
        };

        if (seasonId) {
            fetchTeams();
        }
    }, [API_BASE_URL, seasonId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!selectedTeamId) {
            toast.error("Спочатку оберіть команду.");
            return;
        }

        const newDriver = {
            name,
            nationality,
            driverNumber: parseInt(driverNumber, 10),
            teamId: selectedTeamId
        };

        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/teams/${selectedTeamId}/drivers`, { // ❗️ Переконайся, що твій C# DriversController приймає [HttpPost]
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newDriver),
            });

            if (response.ok) {
                toast.success("Пілот успішно доданий!");
                onDriverAdded();
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Помилка при додаванні пілота.");
            }
        } catch (e) {
            console.error("Помилка мережі при додаванні пілота:", e);
            toast.error("Не вдалося з'єднатися з сервером.");
        }

        setIsSubmitting(true);
        try {
            // ...
        } catch (e) {
            // ...
        } finally {
            setIsSubmitting(false); // Завжди скидаємо
        }
    };

    // --- РЕНДЕРИНГ ---

    // Функція для рендерингу ВМІСТУ картки
    const renderContent = () => {

        // 1. Стан Завантаження
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-8 h-8 border-4 border-zinc-700 border-t-red-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-zinc-400">Завантаження команд...</p>
                </div>
            );
        }

        // 2. Стан "Немає команд" (твій дизайн)
        if (teams.length === 0) {
            return (
                <div className="text-center">
                    <div className="text-5xl text-zinc-500 mb-4" aria-hidden="true">
                        🏎️
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-3">
                        У сезоні немає команд
                    </h3>
                    <p className="text-zinc-400 mb-6">
                        Щоб додати пілота, спочатку створіть хоча б одну команду.
                    </p>
                    {/* Кнопки з виправленим відступом */}
                    <div className="flex flex-col gap-4 mt-8">
                        <button
                            onClick={onAddTeamClick} // Викликаємо проп, переданий з App.jsx
                            className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-xl hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-500"
                        >
                            + Додати Команду
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg"
                        >
                            Скасувати
                        </button>
                    </div>
                </div>
            );
        }

        if(onAddTeamClick){
            return <AddTeamForm onAddTeamClick={onAddTeamClick} />
        }

        // 3. Основна форма (якщо команди є)
        return (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Заголовок всередині форми */}
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">
                    Додати Пілота
                </h2>

                <div>
                    <label htmlFor="team-select" className="block text-sm font-medium text-zinc-400 mb-2">Команда</label>
                    <select
                        id="team-select"
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                        required
                    >
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="driver-name" className="block text-sm font-medium text-zinc-400 mb-2">Ім'я Пілота</label>
                    <input
                        type="text"
                        id="driver-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                        placeholder="Наприклад, Max Verstappen"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="driver-nationality" className="block text-sm font-medium text-zinc-400 mb-2">Національність</label>
                    <input
                        type="text"
                        id="driver-nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                        placeholder="Наприклад, Dutch"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="driver-number" className="block text-sm font-medium text-zinc-400 mb-2">Номер Пілота</label>
                    <input
                        type="number"
                        id="driver-number"
                        value={driverNumber}
                        onChange={(e) => setDriverNumber(e.target.value)}
                        className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                        placeholder="Наприклад, 33"
                        min="1" max="99"
                        required
                    />
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button type="button" onClick={onCancel} className="py-2 px-5 bg-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-600 transition-all">
                        Скасувати
                    </button>
                    <button type="submit" /* disabled={isSubmitting} */ className="py-2 px-5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all disabled:bg-zinc-600">
                        {isSubmitting ? 'Додавання...' : 'Додати Пілота'}
                    </button>
                </div>
            </form>
        );
    };

    // --- ГОЛОВНИЙ RETURN КОМПОНЕНТА ---
    // (Повноекранний контейнер + Картка + Вміст)
    return (
        <div className="min-h-screen bg-zinc-950 text-gray-200 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-lg bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">
                {renderContent()}
            </div>
        </div>
    );
}
