"use client";

import { Mail, MessageSquare, FileText, Settings, Shield } from "lucide-react";

type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type SupportCategoriesProps = {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  faqCount: number;
  onContactClick: () => void;
};

export default function SupportCategories({
                                            categories,
                                            activeCategory,
                                            onCategoryChange,
                                            faqCount,
                                            onContactClick
                                          }: SupportCategoriesProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-8">
      <h3 className="text-lg font-semibold mb-4">
        카테고리
      </h3>

      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeCategory === category.id
                ? "bg-accent text-white"
                : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            {category.icon}
            <span className="font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Contact Card */}
      <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20">
        <Mail className="text-accent mb-2" size={24} />
        <h4 className="font-semibold mb-1">
          직접 문의하기
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          원하는 답변을 찾지 못하셨나요?
        </p>
        <button
          onClick={onContactClick}
          className="text-sm font-medium text-accent hover:underline"
        >
          문의하기 →
        </button>
      </div>
    </div>
  );
}