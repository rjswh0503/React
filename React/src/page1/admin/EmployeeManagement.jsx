import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { 
    Search, UserPlus, Key, Eye, RotateCcw, X, 
    ChevronRight, Users, Mail, Phone, Calendar, Tag, CheckCircle2 
} from "lucide-react";
import api from "../../api/api";

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [inputs, setInputs] = useState({
        employeeNo: '', name: '', password: '1111', departNo: '',
        position: '', email: '', phone: '', joinDate: new Date().toISOString().split('T')[0]
    });

    const navigate = useNavigate();

    useEffect(() => { fetchData(); }, []);

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
            const res = await api.get("/api/employees/search/position", { params: { position: keyword } });
            setSearchList(res.data);
            setIsSearching(true);
        } catch (e) {
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
           .then(() => alert("비밀번호 초기화 완료"))
           .catch(() => alert("실패"));
    };

    const rows = (isSearching ? searchList : employees).filter(
        (emp) => emp.role !== "ADMIN" && emp.position !== "관리자"
    );

    return (
        <div className="flex flex-col gap-8 p-8 bg-slate-50/50 min-h-screen animate-in fade-in duration-700 text-left">
            {/* 상단 헤더 섹션 */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-900 rounded-xl shadow-lg shadow-slate-200">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Employee Management</h1>
                    </div>
                    <p className="text-sm text-slate-400 font-medium italic">사원 인사 정보 관리 시스템</p>
                </div>
                <button 
                    onClick={() => setIsRegModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl text-xs font-black shadow-xl shadow-slate-200 transition-all active:scale-95 uppercase tracking-widest whitespace-nowrap"
                >
                    <UserPlus className="h-4 w-4" /> New Registration
                </button>
            </div>

            {/* 리스트 테이블 카드 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Employee List</h2>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter">Count: {rows.length}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="relative w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="text" placeholder="직급 검색 (예: 대리, 사원)..." className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-slate-400 transition-all shadow-inner" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
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
                        <thead className="bg-white text-slate-400 font-black border-b border-slate-100 uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-10 py-6">사번</th>
                                <th className="px-10 py-6 text-blue-500">성명</th>
                                <th className="px-10 py-6 text-center">부서 / 직급</th>
                                <th className="px-10 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-sans text-slate-900">
                            {loading ? (
                                <tr><td colSpan="4" className="px-10 py-32 text-center text-slate-300 font-black animate-pulse uppercase tracking-widest text-xs">Analyzing Database...</td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan="4" className="px-10 py-32 text-center text-slate-300 font-black italic text-sm">데이터가 존재하지 않습니다.</td></tr>
                            ) : (
                                rows.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-10 py-6 font-mono text-xs font-bold text-slate-400 tabular-nums">#{emp.employeeNo}</td>
                                        <td className="px-10 py-6 font-black text-slate-900">
                                            <Link to={`/dashboard1/employee/${emp.id}/attendance`} state={{ employeeNo: emp.employeeNo, name: emp.name }} className="hover:text-blue-600 transition-all flex items-center gap-1 group/link">
                                                {emp.name} <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-all" />
                                            </Link>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className="text-[11px] font-black text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-tighter whitespace-nowrap">
                                                {emp.department?.departName || "미배정"} / {emp.position}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button onClick={()=> handleResetPassword(emp.id)} className="p-2.5 hover:bg-rose-50 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"><Key className="h-4 w-4 text-rose-500" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ 황금 비율 와이드 모달 (max-w-3xl) */}
            {isRegModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in duration-300 border border-white/20">
                        <form onSubmit={handleRegisterSubmit}>
                            {/* 헤더 */}
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white">
                                <div className="space-y-1 text-left">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Register Team Member</h3>
                                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest opacity-60 italic">시스템 보안을 위해 정확한 정보를 입력하세요</p>
                                </div>
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="bg-slate-50 p-3 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group">
                                    <X className="h-5 w-5 text-slate-300 group-hover:text-white group-hover:rotate-90 transition-all" />
                                </button>
                            </div>

                            {/* 폼 영역: 2열 구조, 간격 최적화 */}
                            <div className="p-10 space-y-10 bg-white">
                                {/* 1열: 기본 신원 */}
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2.5 text-left">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Tag className="w-3.5 h-3.5" /> 사번 (ID No.)
                                        </label>
                                        <input name="employeeNo" value={inputs.employeeNo} onChange={handleInputChange} placeholder="사번 입력" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-black focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900" required />
                                    </div>
                                    <div className="space-y-2.5 text-left">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5" /> 성명 (Full Name)
                                        </label>
                                        <input name="name" value={inputs.name} onChange={handleInputChange} placeholder="성명 입력" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-black focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900" required />
                                    </div>
                                </div>

                                {/* 2열: 소속 강조 섹션 */}
                                <div className="p-8 bg-blue-50/40 rounded-[2.5rem] border border-blue-50/50 grid grid-cols-2 gap-8 shadow-inner shadow-blue-100/10">
                                    <div className="space-y-2.5 text-left">
                                        <label className="text-[11px] font-black text-blue-500 uppercase tracking-widest ml-1">Dept No</label>
                                        <input name="departNo" value={inputs.departNo} onChange={handleInputChange} placeholder="부서 번호" className="w-full px-6 py-4 bg-white border-none rounded-2xl text-xs font-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900" required />
                                    </div>
                                    <div className="space-y-2.5 text-left">
                                        <label className="text-[11px] font-black text-blue-500 uppercase tracking-widest ml-1">Position</label>
                                        <input name="position" value={inputs.position} onChange={handleInputChange} placeholder="직급 입력" className="w-full px-6 py-4 bg-white border-none rounded-2xl text-xs font-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900" required />
                                    </div>
                                </div>

                                {/* 3열: 연락처 및 입사일 */}
                                <div className="space-y-8">
                                    <div className="space-y-2.5 text-left">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5" /> 공식 이메일
                                        </label>
                                        <input type="email" name="email" value={inputs.email} onChange={handleInputChange} placeholder="example@workhub.com" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-black focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2.5 text-left">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" /> 연락처
                                            </label>
                                            <input name="phone" value={inputs.phone} onChange={handleInputChange} placeholder="010-0000-0000" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-black focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900" required />
                                        </div>
                                        <div className="space-y-2.5 text-left">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" /> 입사일
                                            </label>
                                            <input type="date" name="joinDate" value={inputs.joinDate} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-black focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900" required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 푸터 */}
                            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                                <button type="button" onClick={() => setIsRegModalOpen(false)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase text-[11px] tracking-widest">Cancel</button>
                                <button type="submit" className="flex-[1.6] py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] uppercase text-[11px] tracking-widest flex items-center justify-center gap-3">
                                    <UserPlus className="w-4 h-4" /> Save Registration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}