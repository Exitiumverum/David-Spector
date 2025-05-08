'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40" />
          <Image
            src="/images/Homes2/9.png"
            alt="צור קשר"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-light mb-4"
          >
            בואו נדבר
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl font-light"
          >
            אשמח לשמוע מכם ולענות על כל שאלה
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-light mb-6">צור קשר</h2>
                <p className="text-gray-600 mb-8">
                  אשמח לשמוע מכם ולענות על כל שאלה. מלאו את הטופס ואחזור אליכם בהקדם.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">אימייל</h3>
                    <p className="text-gray-600">davidspect82@gmail.com</p>
                  </div>
                </div>

                <a
                  href="https://wa.me/972549865728?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A2%D7%91%D7%95%D7%93%20%D7%90%D7%99%D7%AA%D7%9A%21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 space-x-reverse hover:bg-yellow-50 rounded-lg p-2 transition"
                  aria-label="שלח הודעת וואטסאפ"
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">טלפון</h3>
                    <p className="text-gray-600">054-9865728</p>
                  </div>
                </a>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">כתובת</h3>
                    <p className="text-gray-600">תל אביב, ישראל</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 p-8 rounded-lg shadow-lg"
            >
              <ContactFormWithSuccess />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactFormWithSuccess() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('idle');
    try {
      const res = await fetch('https://formspree.io/f/xldbnzrz', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">שם מלא</label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200"
            placeholder="הכנס את שמך המלא"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">אימייל</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200"
            placeholder="הכנס את כתובת האימייל שלך"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">הודעה</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200"
            placeholder="כתוב את הודעתך כאן..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white px-6 py-4 rounded-md hover:bg-yellow-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
        >
          שלח הודעה
        </button>
      </form>
      {status === 'success' && (
        <div className="mt-4 text-green-700 bg-green-100 border border-green-300 rounded p-4 text-center">
          ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 text-red-700 bg-red-100 border border-red-300 rounded p-4 text-center">
          אירעה שגיאה בשליחת ההודעה. נסה שוב או פנה אלינו ישירות במייל.
        </div>
      )}
    </>
  );
} 