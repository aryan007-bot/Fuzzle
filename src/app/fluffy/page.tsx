import Image from 'next/image';
import Link from 'next/link';

export default function Fluffy() {
  const bgImagePath = '/images/sky_desktop.png';

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center p-8 md:p-12 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImagePath})` }}
    >
      {/* Header */}
      <header className="absolute top-4 left-4 drop-shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Fluffy Guardian
        </h1>
        <p className="text-sm text-white/80 italic mt-1">Born on Sep 24, 2025</p>
      </header>

      {/* Main Content: Monster, Island, and Card */}
      <div className="w-full mt-6 z-10 px-4">
        <div className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-6">
          {/* Island */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-md">
              <Image
                width={520}
                height={260}
                src="/images/landscape_blue_1.svg"
                alt="A floating island"
                className="mx-auto drop-shadow-2xl w-full h-auto"
              />
              <div className="absolute left-1/2 top-6 -translate-x-1/2 w-40">
                <Image
                  width={160}
                  height={160}
                  src="/images/monster.svg"
                  alt="Fluffy monster"
                  className="mx-auto hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-floating-monster"
                />
              </div>
            </div>
          </div>

          {/* Actions Card (side, overlaps slightly on md+) */}
          <div className="relative md:-mt-12 lg:-mt-16 flex justify-center">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl px-6 py-6 shadow-2xl border border-blue-200 w-full max-w-md -translate-y-0 md:-translate-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-blue-700 mb-2 text-2xl font-bold tracking-wide">Monster #6723</h2>
                <button className="ml-4 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full shadow-sm">Info</button>
              </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-100 to-yellow-50 mx-auto flex items-center justify-center shadow-md">
                  <Image width={48} height={48} src="/images/hamburger.svg" alt="Feed" />
                </div>
                <div className="text-sm text-gray-700 mt-2">Feed</div>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 mx-auto flex items-center justify-center shadow-md">
                  <Image width={48} height={48} src="/images/controller.svg" alt="Play" />
                </div>
                <div className="text-sm text-gray-700 mt-2">Play</div>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-100 to-purple-50 mx-auto flex items-center justify-center shadow-md">
                  <Image width={48} height={48} src="/images/text.svg" alt="Chat" />
                </div>
                <div className="text-sm text-gray-700 mt-2">Chat</div>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-100 to-pink-50 mx-auto flex items-center justify-center shadow-md">
                  <Image width={48} height={48} src="/images/aid.svg" alt="Care" />
                </div>
                <div className="text-sm text-gray-700 mt-2">Care</div>
              </div>
            </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Link
                  href="/mingle"
                  className="uppercase bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-3 rounded-xl text-lg font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-300 text-center w-full"
                >
                  Mingle
                </Link>
                <Link
                  href="#"
                  className="uppercase bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-3 rounded-xl text-lg font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-300 text-center w-full"
                >
                  Trade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 z-10">
        <p className="text-white text-center max-w-[350px] mx-auto text-lg drop-shadow-md">
          Keep your guardian healthy and entertained. With time, they’ll grow stronger and care for others.
        </p>
      </footer>
    </main>
  );
}