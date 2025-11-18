import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://f1-backend-63136702003.us-central1.run.app';

function DriverReviewForm({ raceId, seasonId, onReviewSubmit }) {
    // Стани для форми
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [mark, setMark] = useState(5);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Стани для завантаження даних
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDrivers = async () => {
            if (!seasonId) {
                toast.error("Помилка: невідомий ID сезону.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/seasons/${seasonId}/drivers`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error("Не вдалося завантажити пілотів");

                const data = await response.json();
                setDrivers(data);
                if (data.length > 0) {
                    setSelectedDriverId(data[0].id); // Обираємо першого за замовчуванням
                }
            } catch (e) {
                toast.error(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDrivers();
    }, [seasonId]); // Залежність від 'seasonId'

    // ❗️ ТВОЯ ЛОГІКА handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDriverId) {
            toast.error("Будь ласка, оберіть пілота.");
            return;
        }
        setIsSubmitting(true);
        try {
            // ❗️ Твій C# ендпоінт з минулого разу: POST /api/reviews/driver
            const response = await fetch(`${API_BASE_URL}/api/reviews/driver`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mark: mark,
                    description: description,
                    raceId: raceId,
                    driverId: selectedDriverId // <--- Головне поле
                }),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Помилка API");
            }
            toast.success("Відгук на пілота успішно додано!");
            onReviewSubmit();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p className="text-zinc-400 text-center">Завантаження пілотів...</p>
    }

    if (drivers.length === 0) {
        return <p className="text-zinc-400 text-center">У цьому сезоні ще немає пілотів. Спочатку додайте їх у 'Панелі Управління Сезоном'.</p>
    }

    // Дизайн форми
    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-100">Залишити відгук на пілота</h2>

            <div>
                <label htmlFor="driver-select" className="block text-sm font-medium text-zinc-400 mb-2">Пілот</label>
                <select id="driver-select" value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)} className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600" required>
                    {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.name} (#{driver.driverNumber})</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="mark" className="block text-sm font-medium text-zinc-400 mb-2">Оцінка (1-10)</label>
                <input type="number" id="mark" min="1" max="10" value={mark} onChange={(e) => setMark(parseInt(e.target.value))} className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600" required />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-2">Опис</label>
                <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600" placeholder="Що думаєте про виступ цього пілота?" required />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all disabled:bg-zinc-600">
                {isSubmitting ? "Відправка..." : "Відправити відгук"}
            </button>
        </form>
    );
}

export default DriverReviewForm;