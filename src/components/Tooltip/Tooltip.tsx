export default function Tooltip({title}: {title: string}){
  return(
    <div className="absolute w-fit h-fit p-2 left-full top-1/5 border rounded-lg bg-[#cfcbca] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
      {title}
    </div>
  )
}