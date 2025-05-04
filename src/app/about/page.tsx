'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-light mb-8 text-center">אודות</h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-light mb-6">דוד ספקטור</h2>
            <p className="text-gray-600 mb-4">
              עם ניסיון של מעל 15 שנים בתחום האדריכלות ועיצוב הפנים, דוד ספקטור מביא שילוב ייחודי של יצירתיות ומומחיות טכנית לכל פרויקט. עבודתו מתאפיינת בקווים נקיים, תכנון מרחבי מחושב והבנה עמוקה של האינטראקציה בין אנשים לסביבתם.
            </p>
            <p className="text-gray-600">
              דוד מתמחה בפרויקטים מגוונים הכוללים בתי מגורים, חללים מסחריים ופרויקטים של אירוח, כאשר כל פרויקט משקף את מחויבותו ליצירת חללים יפים ופונקציונליים.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/Logos/DavidSpector.jpeg"
              alt="דוד ספקטור"
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
} 