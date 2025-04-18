import ChatSVG from '@/../images/chat-svg.svg'
import Image from "next/image";

export default function Page(){
  return (
    <div className='w-full h-full flex justify-center'>
      <Image alt="" src={ChatSVG} height={500} width={500}/>
    </div>
  )
}