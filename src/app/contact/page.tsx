'use client';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-light mb-8 text-center">צור קשר</h1>
        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-light mb-2">שם מלא</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-yellow-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-light mb-2">אימייל</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-yellow-300"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-light mb-2">הודעה</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-yellow-300"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-300 text-black px-6 py-3 rounded-md hover:bg-yellow-400 transition-colors duration-300"
            >
              שלח הודעה
            </button>
          </form>
        </div>
      </div>
    </main>
  );
} 