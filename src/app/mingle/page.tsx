import Image from 'next/image'
import Link from 'next/link'

export default function Fluffy() {
  const bgimage = './images/aether_desktop.svg'
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-cover" style={{backgroundImage: "url(" + bgimage + ")" }}>
      <div className='absolute top-5 right-5 text-white w-[300px]'>
        <p className='text-4xl'>
          David&apos;s Monster Collection
        </p>
        <p className='text-left opacity-60'>
          Drag and Drop a monster on to another monster’s island to interact!
        </p>
      </div>
      <div className='container'>
        <div className='flex mb-[-210px] mt-[-100px]'>
          <div className='mb-[150px] relative z-100 col-start-2 mr-[-50px] ml-auto'>
            <Image width={400} height={800} src="./images/landscape_blue_1.svg" alt="island"  className='mx-auto mb-[-340px]'/>
            <div className='mx-auto w-[100px]' >
              <Image width={100} height={100} src="./images/Monster_2_3.svg" alt="Monster"  className='flex mx-auto'/>
            </div>
          </div>
          <div className='mb-[150px] relative z-100 ml-[-50px] mr-auto'>
            <Image width={400} height={400} src="./images/LANDSCAPE_PINK_1.svg" alt="island"  className='mx-auto mb-[-340px]'/>
            <div className='mx-auto w-[100px]' >
              <Image width={100} height={100} src="./images/Monster_1_1.svg" alt="Monster"  className='flex mx-auto'/>
            </div>
          </div>
        </div>
        <div className='mb-[150px] relative z-100'>
          <Image width={300} height={300} src="./images/care_island.svg" alt="island"  className='mx-auto mb-[-440px]'/>
          <div className='mx-auto w-[100px]' >
            <Image width={100} height={100} src="./images/Monster_5_2.svg" alt="Monster"  className='flex mx-auto'/>
          </div>
        </div>
        <div className='flex z-10 relative'>
          <div className='bg-white mx-auto rounded-3xl px-5 py-4 min-w-[500px]'>
            <p className='text-black text-center text-xl'>Create a New</p>
            <p className='text-black text-center mb-5 text-xl'>Gelatinous Bio-Mass</p>
            <div className='grid grid-cols-3'>
              <div className='ml-10'>
                <Image width={125} height={125} src="./images/blue_monster.svg" alt="Red Cauldron" className='mx-auto hover:scale-110 transition' />
                <p className='text-black opacity-50 text-center mt-2 text-sm'>
                  Monster #5723
                </p>
              </div>
              <div>
                <Image width={75} height={75} src="./images/Like_perspective_matte.svg" alt="Red Cauldron" className='mx-auto hover:scale-110 transition' />
                <Image width={90} height={90} src="./images/spore_monster.svg" alt="Red Cauldron" className='mx-auto hover:scale-110 transition' />
              </div>
              <div className='mr-10'>
                <Image width={125} height={125} src="./images/yellow_monster.svg" alt="Red Cauldron" className='mx-auto hover:scale-110 transition' />
                <p className='text-black opacity-50 text-center mt-2 text-sm'>
                  Monster #2426
                </p>
              </div>
            </div>

            <div className='mt-5 mb-5 flex'>
              <div className='ml-auto'>
                <Link href="#" className='uppercase bg-[#05B8B7] px-10 py-2 rounded-xl text-xl hover:scale-110 transition shadow-lg mr-5'>Collect</Link>
              </div>
              <div className='mr-auto'>
                <Link href="#" className='uppercase bg-[#747474] px-10 py-2 rounded-xl text-xl hover:scale-110 transition shadow-lg ml-5'>Cancel</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
