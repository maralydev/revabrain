import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
          <Image
            src="/images/logo.png"
            alt="RevaBrain logo"
            width={56}
            height={56}
            className="rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <span className="font-bold text-2xl text-[#1a1a2e]">Reva</span>
            <span className="font-bold text-2xl text-[#2879D8]">Brain</span>
          </div>
        </Link>

        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-[#2879D8]/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#2879D8]/10 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-[#2879D8]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Pagina niet gevonden
        </h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          De pagina die u zoekt bestaat niet of is verplaatst.
          Controleer de URL of ga terug naar de homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#2879D8] text-white font-semibold rounded-lg hover:bg-[#1e60b0] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Naar homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#2879D8] text-[#2879D8] font-semibold rounded-lg hover:bg-[#2879D8]/5 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact opnemen
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Misschien zoekt u:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/treatments" className="text-[#2879D8] hover:underline">
              Behandelingen
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/team" className="text-[#2879D8] hover:underline">
              Ons team
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/costs" className="text-[#2879D8] hover:underline">
              Tarieven
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/disciplines" className="text-[#2879D8] hover:underline">
              Disciplines
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
