import TrumpGame from "@/components/trump-game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gradient-to-b from-red-50 to-blue-50">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-4">Trumplife</h1>
        <TrumpGame />
      </div>
    </main>
  )
}
