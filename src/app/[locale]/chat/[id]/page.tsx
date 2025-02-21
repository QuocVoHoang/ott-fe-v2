
import InputArea from "@/components/InputArea/InputArea"
import MessageArea from "@/components/MessageArea/MessageArea"

export default async function Page({
  params
}: {
  params: Promise<{id: string}>
}) {
  const id = (await params).id
  return (
    <div className="w-full h-full flex flex-col">
      <MessageArea conversationId={id}/>
      <InputArea />
    </div>
  )
}