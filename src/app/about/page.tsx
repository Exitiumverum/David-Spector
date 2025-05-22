'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-light mb-8 text-center">נעים להכיר!</h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-lg text-black">
            <p>
              נעים להכיר!
            </p>
            <p>
              אני מאמין שהמרחב שסביבנו משפיע על איך שאנחנו מרגישים, חושבים, ואפילו על מערכות היחסים שלנו. לפעמים קשה לשים את האצבע על מה הופך חלל ל&quot;נעים&quot; או &quot;קודר&quot; – אבל כולנו מרגישים את זה מיד.
            </p>
            <p>
              דרך עיצוב, תכנון והדמיה, אני עוזר לאנשים לראות את הפוטנציאל האמיתי של נכסים – בין אם הם גרים בהם, משכירים אותם או רוצים לקנות נכס.
            </p>
            <p>
              שינוי קטן יכול לעשות הבדל ענק – בדיוק בשביל זה אני כאן.
            </p>
            <p>
              צברתי ניסיון עשיר בתכנון, עיצוב וניהול פרויקטים – מדירות ובתים פרטיים ועד שכונות של מאות יחידות דיור במשרד פיבקו אדריכלים ועוד. כיום אני משלב את תחומי ההתמחות שלי – אדריכלות, עיצוב פנים ותיווך נדל&quot;ן ברימקס אושן תל אביב – כדי להעניק לכם פתרון שלם, מקצועי ומדויק.
            </p>
            <p>
              בזכות ההבנה הרחבה שלי במרחב, בערך שעיצוב טוב נותן ובשוק הנדל&quot;ן, אני רואה את הנכס שלכם לא רק כמו שהוא – אלא כמו שהוא יכול להיות.
            </p>
            {/* <p className="text-gray-600">
              דוד מתמחה בפרויקטים מגוונים הכוללים בתי מגורים, חללים מסחריים ופרויקטים של אירוח, כאשר כל פרויקט משקף את מחויבותו ליצירת חללים יפים ופונקציונליים.
            </p> */}
          </div>
          <div className="relative w-[250px] h-[250px] md:w-[400px] md:h-[400px] mx-auto md:mx-0">
            <Image
              src="/images/Logos/DavidSpector.jpeg"
              alt="דוד ספקטור"
              fill
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
} 