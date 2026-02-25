import React from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, subtitle, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            {/* 배경 (클릭 시 닫힘) */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                onClick={onClose}
            ></div>
            
            {/* 모달 본체 */}
            <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* 헤더 */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">{title}</h3>
                        {subtitle && (
                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* 내용물 (form, input, 버튼 등이 들어갈 자리) */}
                {children}
            </div>
        </div>
    );
}