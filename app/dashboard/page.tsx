import Sidebar from '@/components/sidebar'
import React from 'react'

export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Sidebar currentPath='/dashboard' />
      <main className='ml-64 p-8'>
        {/* Header */}
        <div>
          <div>
            <div>
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
