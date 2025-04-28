
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-arabicBlue text-white p-6 rounded-lg mb-6 text-center">
      <h1 className="text-3xl font-bold mb-2">مُطابق الأسئلة العربية</h1>
      <p className="rtl opacity-90">
        قارن بين مجموعتين من الأسئلة بناءً على معايير محددة وعرض النتائج بشكل مرئي سهل الاستخدام
      </p>
    </header>
  );
};

export default Header;
