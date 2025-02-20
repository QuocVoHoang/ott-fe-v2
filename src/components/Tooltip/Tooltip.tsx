export default function Tooltip({title}: {title: string}){
  return(
    <div className="absolute w-fit h-fit p-2 top-1/5 left-full translate-x-2 border rounded-lg bg-[#cfcbca] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none">
      {title}
    </div>
  )
}