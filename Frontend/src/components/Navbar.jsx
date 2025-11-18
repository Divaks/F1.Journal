import React from 'react';

// Navbar приймає ті самі пропси, що й раніше
function Navbar({ onViewDashboard, onViewSeasons, onLogout }) {
    return (
        // Ми використовуємо <header> для семантики
        // 'border-b' створює чітку лінію F1-червоного кольору
        <header className="w-full border-b border-red-600/50 mb-8 sm:mb-12">

            {/* 'max-w-7xl' та 'mx-auto' центрують контент і обмежують ширину
              'px-4' додає відступи по боках на мобільних
            */}
            <nav className="flex justify-between items-center max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">

                {/* Лого/Назва. Це кнопка "Додому" */}
                <h1
                    className="text-2xl sm:text-3xl font-bold text-gray-100 cursor-pointer hover:text-red-500 transition-colors"
                    onClick={onViewSeasons}
                >
                    F1<span className="text-red-600">.</span>Journal
                </h1>

                {/* Блок з діями користувача */}
                <div>
                    <button
                        className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        onClick={onViewDashboard}
                    >
                        Мій Кабінет <span aria-hidden="true">👤</span>
                    </button>

                    <button
                        onClick={onLogout}
                        // Додаємо 'ml-3' (margin-left) для мобільних
                        // і 'sm:ml-4' для великих екранів
                        className="ml-3 sm:ml-4 px-4 py-2 bg-zinc-700 text-gray-200 text-sm font-semibold rounded-lg hover:bg-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    >
                        Вийти
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;