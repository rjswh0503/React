import React from 'react';



const good = () => {

    return (
        <div class="flex h-screen bg-gray-100">

            <aside class="w-64 bg-slate-800 text-white flex flex-col">
                <div class="p-6 text-2xl font-bold border-b border-slate-700 text-blue-400">HR System</div>
                <nav class="flex-1 p-4 space-y-2">
                    <button class="w-full flex items-center p-3 bg-blue-600 rounded-lg">🏠 홈 (대시보드)</button>
                    <button class="w-full flex items-center p-3 hover:bg-slate-700 rounded-lg transition">📅 근무 기록</button>
                    <button class="w-full flex items-center p-3 hover:bg-slate-700 rounded-lg transition">🏖️ 휴가 신청</button>
                    <button class="w-full flex items-center p-3 hover:bg-slate-700 rounded-lg transition">⚙️ 설정</button>
                </nav>
            </aside>

            <main class="flex-1 flex flex-col overflow-hidden">

                <header class="bg-white border-b px-8 shadow-sm">
                    <div class="flex space-x-8">
                        <button class="py-4 border-b-2 border-blue-500 text-blue-600 font-bold">출근일 현황</button>
                        <button class="py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700">연차 관리</button>
                        <button class="py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700">급여 명세서</button>
                    </div>
                </header>

                <div class="flex-1 overflow-y-auto p-8">

                    <div class="grid grid-cols-12 gap-6">
                        <div class="col-span-12 lg:col-span-4 bg-white p-8 rounded-3xl shadow-lg border-4 border-blue-50 border-t-blue-500">
                            <h2 class="text-gray-500 font-medium">오늘의 근무</h2>
                            <div class="mt-4 text-4xl font-black text-slate-800">09:12:45</div>
                            <div class="mt-6 flex gap-3">
                                <button class="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">출근하기</button>
                                <button class="flex-1 bg-gray-200 text-gray-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition">퇴근하기</button>
                            </div>
                        </div>

                        <div class="col-span-12 lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-xl font-bold">이번 달 출근 현황</h3>
                                <span class="text-blue-600 font-semibold text-sm">2026년 1월</span>
                            </div>
                            <div class="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400">
                                <div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div class="text-blue-300">토</div><div class="text-red-300">일</div>
                            </div>
                            <div class="grid grid-cols-7 gap-2 mt-2">
                                <div class="h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold">1</div>
                                <div class="h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold border-2 border-blue-400">2</div>
                                <div class="h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">3</div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )

}

export default good;