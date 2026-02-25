import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Search, UserPlus, Key, Eye, RotateCcw, X } from "lucide-react";

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);      // 전체 목록
    const [searchList, setSearchList] = useState([]);     // 검색 결과
    const [isSearching, setIsSearching] = useState(false); // 검색모드 여부
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색 입력값

    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [inputs, setInputs] = useState({
        employeeNo: '',
        name: '',
        password: '1111',
        departNo: '',
        position: '',
        email: '',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const responseData = await api.get("/api/admin/employees");
            setEmployees(responseData.data);
        } catch (e) {
            console.error("데이터 로드 실패", e);
        } finally {
            setLoading(false);
        }
    };

    // --- 검색 로직 복구 ---
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        const keyword = searchKeyword.trim();
        if (!keyword) return;

        try {
            const res = await api.get("/api/employees/search/position", {
                params: { position: keyword },
            });
            setSearchList(res.data);
            setIsSearching(true);
        } catch (e) {
            console.error("검색 실패", e);
            setSearchList([]);
            setIsSearching(true);
        }
    };

    const handleReset = () => {
        setIsSearching(false);
        setSearchList([]);
        setSearchKeyword("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/admin/register", inputs);
            alert("사원이 성공적으로 등록되었습니다.");
            setIsRegModalOpen(false);
            setInputs({
                employeeNo: '', name: '', password: '1111', departNo: '',
                position: '', email: '', phone: '', joinDate: new Date().toISOString().split('T')[0]
            });
            fetchData();
        } catch (e) {
            alert("등록 실패: 입력 정보를 확인해주세요.");
        }
    };

    // 필터링된 행 데이터
    const rows = (isSearching ? searchList : employees).filter(
        (emp) => emp.role !== "ADMIN" && emp.position !== "관리자"
    );

    return (
        <div className="flex flex-col gap-6 p-6 bg-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">사원 관리</h1>
                    <p className="text-sm text-slate-500 font-medium">전체 사원 정보를 관리합니다.</p>
                </div>
                <button 
                    onClick={() => setIsRegModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-95"
                >
                    <UserPlus className="h-4 w-4" />
                    사원 등록
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900 font-sans">
                        {isSearching ? "검색 결과" : "사원 목록"}
                    </h2>
                    
                    {/* ✅ 검색 바 UI 복구 */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="직급 검색 (예: 대리, 사원)..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-slate-900"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </form>
                        {isSearching && (
                            <button 
                                onClick={handleReset}
                                className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-xl transition-all"
                                title="초기화"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 uppercase text-[11px]">사번</th>
                                <th className="px-6 py-4 uppercase text-[11px]">이름</th>
                                <th className="px-6 py-4 uppercase text-[11px]">부서 / 직급</th>
                                <th className="px-6 py-4 text-right uppercase text-[11px]">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans text-slate-900">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">데이터를 불러오는 중...</td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">검색 결과가 없습니다.</td></tr>
                            ) : (
                                rows.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-700">{emp.employeeNo}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{emp.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-blue-600">{emp.department?.departName || "미배정"}</span>
                                                <span className="text-[11px] text-slate-500 font-medium">{emp.position}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg"><Eye className="h-4 w-4 text-slate-400" /></button>
                                                <button className="p-2 hover:bg-amber-50 rounded-lg"><Key className="h-4 w-4 text-amber-500" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

           
            {isRegModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRegModalOpen(false)}></div>
                    <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">사원 개별 등록</h3>
                                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Employee Registration</p>
                                </div>
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-8 grid grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">사번</label>
                                    <input name="employeeNo" value={inputs.employeeNo} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">성명</label>
                                    <input name="name" value={inputs.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">부서 번호</label>
                                    <input name="departNo" value={inputs.departNo} onChange={handleInputChange} placeholder="숫자 입력" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">직급</label>
                                    <input name="position" value={inputs.position} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">이메일 주소</label>
                                    <input type="email" name="email" value={inputs.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">전화번호</label>
                                    <input name="phone" value={inputs.phone} onChange={handleInputChange} placeholder="010-0000-0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">입사 일자</label>
                                    <input type="date" name="joinDate" value={inputs.joinDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase text-xs tracking-widest">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black shadow-xl shadow-slate-200 transition-all uppercase text-xs tracking-widest">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}