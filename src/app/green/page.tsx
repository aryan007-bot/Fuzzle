import Image from 'next/image';
import Link from 'next/link';

export default function Green() {
  const bgImagePath = '/images/sky_desktop.png';

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-between p-24 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImagePath})` }}
    >
      {/* Header */}
      <header className="absolute top-5 left-5 drop-shadow-xl">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Green Guardian
        </h1>
        <p className="text-lg text-white/80 italic mt-1">Born on Sep 25, 2025</p>
      </header>

      {/* Main Content: Monster, Island, and Card */}
      <div className="container mt-10 z-10">
        <div className="mb-[150px] relative">
          <Image
            width={300}
            height={300}
            src="/images/care_island.svg"
            alt="A floating island with a grassy top."
            className="mx-auto drop-shadow-2xl animate-floating-island"
            style={{ marginBottom: '-490px' }}
          />
          <div className="mx-auto w-[170px] relative">
            <Image
              width={170}
              height={170}
              src="/images/green.png"
              alt="A green guardian monster."
              className="mx-auto hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.8)] animate-floating-monster"
            />
          </div>
        </div>

        <div className="flex z-10 relative group">
          <div className="bg-white/80 backdrop-blur-lg mx-auto rounded-3xl px-8 py-6 shadow-2xl border border-white/30 max-w-lg w-full">
            <h2 className="text-black mb-6 text-2xl font-bold tracking-wide">Monster #GREEN</h2>
            <div className="grid grid-cols-4 gap-4">
              <Image width={75} height={75} src="/images/hamburger.svg" alt="Feed" className="mx-auto hover:scale-125 transition-transform duration-300 drop-shadow-md" />
              <Image width={90} height={90} src="/images/controller.svg" alt="Play" className="mx-auto hover:scale-125 transition-transform duration-300 drop-shadow-md" />
              <Image width={85} height={85} src="/images/text.svg" alt="Chat" className="mx-auto hover:scale-125 transition-transform duration-300 drop-shadow-md" />
              <Image width={65} height={65} src="/images/aid.svg" alt="Care" className="mx-auto hover:scale-125 transition-transform duration-300 drop-shadow-md" />
            </div>

            <div className="mt-8 flex justify-between">
              <Link href="/mingle" className="uppercase bg-gradient-to-r from-blue-400 to-blue-600 px-10 py-3 rounded-xl text-lg font-semibold text-white shadow-lg hover:scale-110 transition-transform duration-300">Mingle</Link>
              <Link href="#" className="uppercase bg-gradient-to-r from-gray-600 to-gray-800 px-10 py-3 rounded-xl text-lg font-semibold text-white shadow-lg hover:scale-110 transition-transform duration-300">Trade</Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-6 z-10">
        <p className="text-white text-center max-w-[350px] mx-auto text-lg drop-shadow-md">Care for your guardian to grow stronger and help others in time.</p>
      </footer>
    </main>
  );
}
