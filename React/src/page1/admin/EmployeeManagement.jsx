import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserPlus, Key, Eye, RotateCcw, X, ChevronRight, Users } from "lucide-react";
import api from "../../api/api";

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    
    // 등록 폼 상태
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

    const navigate = useNavigate();

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

    const handleResetPassword = (id) => {
        if (!window.confirm("비밀번호를 초기화하시겠습니까?")) return;
        api.post(`/api/admin/employee/${id}/password-reset`)
           .then(() => alert("비밀번호가 초기화되었습니다."))
           .catch(() => alert("실패했습니다."));
    };

    const rows = (isSearching ? searchList : employees).filter(
        (emp) => emp.role !== "ADMIN" && emp.position !== "관리자"
    );

    return (
        <div className="flex flex-col gap-8 p-8 bg-slate-50/50 min-h-screen animate-in fade-in duration-700">
            {/* 헤더 */}
            <div className="flex items-end justify-between bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="space-y-2 text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-xl">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Employee Management</h1>
                    </div>
                    <p className="text-sm text-slate-400 font-medium italic">전체 사원의 인사 정보를 관리하고 근태 페이지로 이동합니다.</p>
                </div>
                <button 
                    onClick={() => setIsRegModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-2xl text-xs font-black shadow-xl shadow-slate-200 transition-all active:scale-95 uppercase tracking-widest"
                >
                    <UserPlus className="h-4 w-4" /> New Registration
                </button>
            </div>

            {/* 리스트 카드 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                            {isSearching ? "Search Results" : "Employee List"}
                        </h2>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase">
                            Count: {rows.length}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <form onSubmit={handleSearch} className="relative w-full lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="직급 검색 (예: 대리, 사원)..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-slate-900 shadow-inner"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </form>
                        {isSearching && (
                            <button onClick={handleReset} className="p-3 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-2xl transition-all shadow-sm">
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto text-left">
                    <table className="w-full">
                        <thead className="bg-white text-slate-400 font-black border-b border-slate-100">
                            <tr>
                                <th className="px-10 py-6 uppercase text-[10px] tracking-widest">사번</th>
                                <th className="px-10 py-6 uppercase text-[10px] tracking-widest text-blue-500">성명</th>
                                <th className="px-10 py-6 uppercase text-[10px] tracking-widest text-center">부서 / 직급</th>
                                <th className="px-10 py-6 text-right uppercase text-[10px] tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-sans text-slate-900">
                            {loading ? (
                                <tr><td colSpan="4" className="px-10 py-32 text-center text-slate-300 font-black animate-pulse uppercase tracking-widest text-xs">Analyzing Database...</td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan="4" className="px-10 py-32 text-center text-slate-300 font-black italic text-sm">기록된 사원 데이터가 없습니다.</td></tr>
                            ) : (
                                rows.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-10 py-6 font-mono text-xs font-bold text-slate-400 tabular-nums">#{emp.employeeNo}</td>
                                        <td className="px-10 py-6">
                                            {/* ✅ state를 통해 상세 페이지로 데이터 전달 */}
                                            <Link 
                                                to={`/dashboard1/employee/${emp.id}/attendance`}
                                                state={{ employeeNo: emp.employeeNo, name: emp.name }}
                                                className="font-black text-slate-900 hover:text-blue-600 transition-all flex items-center gap-2 group/link"
                                            >
                                                {emp.name}
                                                <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-all transform -translate-x-1 group-hover/link:translate-x-0" />
                                            </Link>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-[11px] font-black text-blue-500 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md mb-1">{emp.department?.departName || "미배정"}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{emp.position}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all shadow-sm"><Eye className="h-4 w-4 text-slate-400" /></button>
                                                <button onClick={()=> handleResetPassword(emp.id)} className="p-2.5 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all shadow-sm"><Key className="h-4 w-4 text-rose-500" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 사원 등록 모달 */}
            {isRegModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsRegModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Register Employee</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60 italic">신규 사원 정보 등록</p>
                                </div>
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors bg-white p-3 rounded-full border border-slate-100 shadow-sm">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-12 grid grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee No</label>
                                    <input name="employeeNo" value={inputs.employeeNo} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input name="name" value={inputs.name} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-blue-500">Department No</label>
                                    <input name="departNo" value={inputs.departNo} onChange={handleInputChange} className="w-full px-6 py-4 bg-blue-50/30 border border-blue-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position</label>
                                    <input name="position" value={inputs.position} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="col-span-2 space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" name="email" value={inputs.email} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input name="phone" value={inputs.phone} onChange={handleInputChange} placeholder="010-0000-0000" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Join Date</label>
                                    <input type="date" name="joinDate" value={inputs.joinDate} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-black focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900" required />
                                </div>
                            </div>

                            <div className="p-12 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest">Cancel</button>
                                <button type="submit" className="flex-1 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black shadow-2xl shadow-slate-200 transition-all uppercase text-[10px] tracking-widest">Register Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}