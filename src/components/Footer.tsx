
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 text-center p-6 text-sm text-muted-foreground">
      <p className="rtl">
        مُطابق الأسئلة العربية - تم التطوير بواسطة مبرمج محترف - جميع الحقوق محفوظة {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
