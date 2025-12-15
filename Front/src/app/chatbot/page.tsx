'use client'

import { Header } from '@/components/Header'
import { ChatContainer } from '@/components/chatbot/ChatContainer'

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <ChatContainer />
      </div>
    </div>
  )
}

export default Page
