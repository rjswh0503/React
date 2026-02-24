"use client"

import React, { useState, useEffect } from "react"
import { Building2, Plus, Edit, Trash2, Phone, Mail, MapPin, X } from "lucide-react"

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingDept, setEditingDept] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        departName: "",
        departTel: "",
        departMail: "",
        departLocation: ""
    })

    useEffect(() => {
        loadDepartments()
    }, [])

    async function loadDepartments() {
        try {
            setLoading(true)
            const data = await fetchDepartments()
            setDepartments(data)
        } catch (error) {
            console.error("부서 목록 로드 실패")
            alert("부서 목록을 불러오는데 실패했습니다.")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            departName: "",
            departTel: "",
            departMail: "",
            departLocation: ""
        })
        setEditingDept(null)
    }

    const handleOpenCreate = () => {
        resetForm()
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (dept) => {
        setEditingDept(dept)
        setFormData({
            departName: dept.departName,
            departTel: dept.departTel,
            departMail: dept.departMail,
            departLocation: dept.departLocation
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingDept) {
                await adminUpdateDepartment(editingDept.departNo, formData)
            } else {
                await adminCreateDepartment(formData)
            }
            setIsDialogOpen(false)
            loadDepartments()
        } catch (error) {
            alert(error.message || "처리에 실패했습니다.")
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("정말 이 부서를 삭제하시겠습니까? 관련 사원 정보에 영향을 줄 수 있습니다.")) return
        try {
            await adminDeleteDepartment(id)
            loadDepartments()
        } catch (error) {
            alert(error.message || "삭제 실패")
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-white">
            {/* 헤더 섹션 */}
            <div className="flex items-center justify-between text-slate-900">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">부서 관리</h1>
                    <p className="text-sm text-slate-500 font-medium">조직의 부서를 추가하고 정보를 관리합니다.</p>
                </div>
                <button 
                    onClick={handleOpenCreate} 
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    부서 생성
                </button>
            </div>

            {/* 테이블 카드 섹션 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">부서 목록</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">현재 등록된 모든 부서의 상세 정보입니다.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-600">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider">부서명</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider">연락처</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider">이메일</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider">위치</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">데이터를 불러오는 중...</td>
                                </tr>
                            ) : departments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">등록된 부서가 없습니다.</td>
                                </tr>
                            ) : (
                                departments.map((dept) => (
                                    <tr key={dept.departNo} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-bold text-slate-900">
                                                <Building2 className="h-4 w-4 text-blue-500" />
                                                {dept.departName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <Phone className="h-3 w-3 text-slate-400" />
                                                {dept.departTel}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <Mail className="h-3 w-3 text-slate-400" />
                                                {dept.departMail}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <MapPin className="h-3 w-3 text-slate-400" />
                                                {dept.departLocation}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleOpenEdit(dept)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(dept.departNo)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 커스텀 모달 (Dialog) */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDialogOpen(false)} />
                    
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {editingDept ? "부서 정보 수정" : "새 부서 등록"}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">부서의 기본 정보를 입력해주세요.</p>
                                </div>
                                <button type="button" onClick={() => setIsDialogOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 ml-1">부서명</label>
                                    <input 
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-slate-900 font-medium"
                                        value={formData.departName} 
                                        onChange={e => setFormData({ ...formData, departName: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 ml-1">연락처</label>
                                    <input 
                                        placeholder="02-XXX-XXXX"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-slate-900 font-medium"
                                        value={formData.departTel} 
                                        onChange={e => setFormData({ ...formData, departTel: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 ml-1">이메일</label>
                                    <input 
                                        type="email" 
                                        placeholder="dept@workhub.com"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-slate-900 font-medium"
                                        value={formData.departMail} 
                                        onChange={e => setFormData({ ...formData, departMail: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 ml-1">위치</label>
                                    <input 
                                        placeholder="예: 4층 A구역"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-slate-900 font-medium"
                                        value={formData.departLocation} 
                                        onChange={e => setFormData({ ...formData, departLocation: e.target.value })} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    취소
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    {editingDept ? "수정 완료" : "등록 완료"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}