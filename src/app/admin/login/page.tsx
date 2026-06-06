import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-black tracking-tighter text-white">어드민</h1>
          <p className="text-sm text-gray-400">접근하려면 비밀번호를 입력하세요.</p>
        </div>

        <div className="w-full bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
