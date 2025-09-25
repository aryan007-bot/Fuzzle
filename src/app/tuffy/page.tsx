import Image from 'next/image';
import Link from 'next/link';

export default function Tuffy() {
  const bgImagePath = '/images/sky_desktop.png';

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center p-8 md:p-12 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImagePath})` }}
    >
      <header className="absolute top-4 left-4 drop-shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
          Tuffy Guardian
        </h1>
        <p className="text-sm text-white/80 italic mt-1">Born on Sep 24, 2025</p>
      </header>

      <div className="w-full mt-6 z-10 flex flex-col items-center px-4">
        {/* Island with centered monster */}
  <div className="relative w-full max-w-md mb-4">
          <Image
            width={520}
            height={260}
            src="/images/LANDSCAPE_PINK_1.svg"
            alt="A floating island"
            className="mx-auto drop-shadow-2xl w-full h-auto"
          />
          <div className="absolute left-1/2 top-6 -translate-x-1/2 w-40">
            <Image
              width={160}
              height={160}
              src="/images/red-removebg-preview.png"
              alt="Red monster"
              className="mx-auto hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-floating-monster"
            />
          </div>
        </div>

  {/* Actions Card */}
  <div className="w-full max-w-lg px-4 -mt-12 relative z-30">
    <div className="bg-white/90 backdrop-blur-md rounded-3xl px-6 py-6 shadow-2xl border border-red-200 w-full relative z-40">
            <h2 className="text-red-700 mb-4 text-2xl font-bold tracking-wide">Monster #6723</h2>
            <div className="grid grid-cols-4 gap-4 text-center mb-4">
              <div>
                <div className="w-14 h-14 rounded-full bg-yellow-50 mx-auto flex items-center justify-center shadow-lg">
                  <Image width={48} height={48} src="/images/hamburger.svg" alt="Feed" />
                </div>
                <div className="text-sm text-gray-800 mt-1">Feed</div>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-indigo-50 mx-auto flex items-center justify-center shadow-lg">
                  <Image width={48} height={48} src="/images/controller.svg" alt="Play" />
                </div>
                <div className="text-sm text-gray-800 mt-1">Play</div>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-purple-50 mx-auto flex items-center justify-center shadow-lg">
                  <Image width={48} height={48} src="/images/text.svg" alt="Chat" />
                </div>
                <div className="text-sm text-gray-800 mt-1">Chat</div>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-pink-50 mx-auto flex items-center justify-center shadow-lg">
                  <Image width={48} height={48} src="/images/aid.svg" alt="Care" />
                </div>
                <div className="text-sm text-gray-800 mt-1">Care</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/mingle"
                className="w-full text-center uppercase bg-gradient-to-r from-pink-500 to-red-600 px-6 py-4 rounded-2xl text-lg font-bold text-white shadow-2xl hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
              >
                Mingle
              </Link>
              <Link
                href="#"
                className="w-full text-center uppercase bg-gradient-to-r from-red-600 to-red-800 px-6 py-4 rounded-2xl text-lg font-bold text-white shadow-2xl hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                Trade
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-6 z-10">
        <p className="text-white text-center max-w-[350px] mx-auto text-lg drop-shadow-md">
          Keep your guardian healthy and entertained. With time, they’ll grow stronger and care for others.
        </p>
      </footer>
    </main>
  );
}
