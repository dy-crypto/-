import LeadForm from './LeadForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* 로고 */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-6xl font-black tracking-tighter text-white">
            아무거나
          </h1>
          <p className="text-sm font-medium tracking-widest text-gray-400 uppercase">
            Anything. Anytime. Anywhere.
          </p>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-gray-800" />

        {/* 폼 카드 */}
        <div className="w-full bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-1">문의하기</h2>
          <p className="text-sm text-gray-400 mb-6">아래 정보를 입력해 주시면 빠르게 연락드리겠습니다.</p>
          <LeadForm />
        </div>
      </div>
    </main>
  )
}
