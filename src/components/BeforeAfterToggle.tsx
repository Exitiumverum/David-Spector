import { useState } from 'react';
import Image from 'next/image';

export default function BeforeAfterToggle({ beforeImg, afterImg, label }: { beforeImg: string; afterImg: string; label: string }) {
    const [showAfter, setShowAfter] = useState(false);
    return (
      <div className="space-y-4 flex flex-col items-center">
        <h3 className="text-xl font-light text-center mb-2 text-black">{label}</h3>
        <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-inherit">
          <Image
            src={showAfter ? afterImg : beforeImg}
            alt={label}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        <button
          className="mt-2 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
          onClick={() => setShowAfter((prev) => !prev)}
        >
          {showAfter ? 'הצג לפני' : 'הצג אחרי'}
        </button>
      </div>
    );
  } 