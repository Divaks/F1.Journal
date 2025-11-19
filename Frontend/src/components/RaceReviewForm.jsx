import React, { useState } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://f1-journal.onrender.com';

function RaceReviewForm({ raceId, onReviewSubmit }) {
    const [mark, setMark] = useState(5);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/race`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mark: mark,
                    description: description,
                    raceId: raceId,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Помилка API");
            }

            toast.success("Відгук на гонку успішно додано!");
            onReviewSubmit();

        } catch (e) {
            toast.error(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-100">Залишити відгук на гонку</h2>

            <div>
                <label htmlFor="mark" className="block text-sm font-medium text-zinc-400 mb-2">Оцінка (1-10)</label>
                <input type="number" id="mark" min="1" max="10" value={mark} onChange={(e) => setMark(parseInt(e.target.value))} className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-2">Опис</label>
                <textarea id="description" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-zinc-800 text-gray-100 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600" placeholder="Які ваші враження від гонки?" required />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all disabled:bg-zinc-600">
                {isSubmitting ? "Відправка..." : "Відправити відгук"}
            </button>
        </form>
    );
}

export default RaceReviewForm;