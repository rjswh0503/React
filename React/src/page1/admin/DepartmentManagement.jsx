"use client"

import React, { useState, useEffect } from "react"
import { Building2, Plus, Edit, Trash2, Phone, Mail, MapPin, X } from "lucide-react"
import api from '../../api/api';

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingDept, setEditingDept] = useState(null)

    
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
            
            const response = await api.get('/api/departments/list')
            setDepartments(response.data)
            console.log("불러온 부서 데이터:", response.data)
        } catch (error) {
            console.error("부서 목록 로드 실패:", error)
            alert("부서 목록을 불러오는데 실패했습니다.")
        } finally {
            setLoading(false)
        }
    }

   
    const adminCreateDepartment = async (data) => {
        
        const response = await api.post('/api/departments/add', data)
        return response.data
    }

   
    const adminDeleteDepartment = async (id) => {
        const response = await api.delete(`/api/departments/${id}`)
        return response.data 
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

    // 4. 등록 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("백엔드로 전송하는 데이터:", formData)

        try {
            if (editingDept) {
                alert("수정 기능은 아직 백엔드 API가 연결되지 않았습니다.")
            } else {
                await adminCreateDepartment(formData)
            }
            setIsDialogOpen(false)
            loadDepartments() 
        } catch (error) {
            
            const errorMsg = error.response?.data?.message || error.message || "처리에 실패했습니다."
            alert(errorMsg)
        }
    }

    
    const handleDelete = async (id) => {
        if (!window.confirm("정말 이 부서를 삭제하시겠습니까? 관련 사원 정보에 영향을 줄 수 있습니다.")) return
        
        try {
            const message = await adminDeleteDepartment(id)
            console.log("삭제 응답:", message)
            loadDepartments() 
        } catch (error) {
            const errorMsg = error.response?.data || error.message || "삭제 실패"
            alert(errorMsg)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between text-slate-900">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">부서 관리</h1>
                    <p className="text-sm text-slate-500 font-medium">Workhub 조직의 부서를 추가하고 정보를 관리합니다.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    부서 생성
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">부서 목록</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-600">
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">부서명</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">연락처</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">이메일</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">위치</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">데이터를 불러오는 중...</td>
                                </tr>
                            ) : departments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">등록된 부서가 없습니다.</td>
                                </tr>
                            ) : (
                                departments.map((dept, index) => (
                                    <tr key={dept.departNo || dept.DepartNo || index} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-bold text-slate-900">
                                                <Building2 className="h-4 w-4 text-blue-500" />
                                                {dept.departName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{dept.departTel}</td>
                                        <td className="px-6 py-4 text-slate-600">{dept.departMail}</td>
                                        <td className="px-6 py-4 text-slate-600">{dept.departLocation}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit className="h-4 w-4" /></button>
                                               
                                                <button 
                                                    onClick={() => handleDelete(dept.departNo || dept.DepartNo)} 
                                                    className="p-2 text-slate-400 hover:text-red-600 transition-all"
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

            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold">부서 등록</h3>
                                <button type="button" onClick={() => setIsDialogOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">부서명</label>
                                    <input
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none"
                                        value={formData.departName}
                                        onChange={e => setFormData({...formData, departName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">연락처</label>
                                    <input
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none"
                                        value={formData.departTel}
                                        onChange={e => setFormData({...formData, departTel: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">이메일</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none"
                                        value={formData.departMail}
                                        onChange={e => setFormData({...formData, departMail: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">위치</label>
                                    <input
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none"
                                        value={formData.departLocation}
                                        onChange={e => setFormData({...formData, departLocation: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="p-6 bg-slate-50 flex gap-3">
                                <button type="button" onClick={() => setIsDialogOpen(false)} className="flex-1 py-2.5 bg-white border rounded-xl font-bold">취소</button>
                                <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold">등록 완료</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}