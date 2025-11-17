import Sidebar from '@/components/sidebar'
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma'
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'

export default async function DashboardPage() {

  const user = await getCurrentUser()
  const userId = user.id

  // array to query all these metrics
  const [totalProducts, lowStock, allProducts] = await Promise.all([
    // total products
    prisma.product.count({ where: { userId } }),

    // low stocks
    prisma.product.count({
      where: {
        userId,
        lowStockAt: { not: null }, quantity: { lte: 5 },
      },
    }),

    // all prodcuts
    prisma.product.findMany({
      where: { userId },
      select: { price: true, quantity: true, createdAt: true },
    }),
  ])

  const recent = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalValue = allProducts.reduce((sum, prodcut) => sum + Number(prodcut.price) * Number(prodcut.quantity), 0);

  console.log(totalValue)

  return (
    <div className='min-h-screen bg-zinc-50'>
      <Sidebar currentPath='/dashboard' />
      <main className='ml-64 p-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <h1 className='text-2xl font-semibold text-zinc-900'>Dashboard</h1>
              <p className='text-sm text-zinc-500'>Welcome back! Here is an overview of your inventory</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Metrics */}
          <div className='bg-white rounded-lg border border-zinc-200 p-6'>
            <h2 className='text-lg font-semibold text-zinc-900 mb-6'>Key Metrics</h2>
            <div className='grid grid-cols-3 gap-6 '>
              {/* Total Products */}
              <div className='text-center'>
                <div className='text-3xl font-bold text-zinc-900'>{totalProducts}</div>
                <div className='text-sm text-zinc-600'>Total Prodcuts</div>
                <div className='flex items-center justify-center mt-1'>
                  <span className='text-xs text-green-600'>+{totalProducts}</span>
                  <TrendingUp className='w-3 h-3 text-green-600 ml-1' />
                </div>
              </div>

              {/* Total Value */}
              <div className='text-center'>
                <div className='text-3xl font-bold text-zinc-900'>${Number(totalValue).toFixed(0)}</div>
                <div className='text-sm text-zinc-600'>Total Prodcuts</div>
                <div className='flex items-center justify-center mt-1'>
                  <span className='text-xs text-green-600'>+${Number(totalValue).toFixed(0)}</span>
                  <TrendingUp className='w-3 h-3 text-green-600 ml-1' />
                </div>
              </div>

              {/* Low Stocks */}
              <div className='text-center'>
                <div className='text-3xl font-bold text-zinc-900'>{lowStock}</div>
                <div className='text-sm text-zinc-600'>Low Stock</div>
                <div className='flex items-center justify-center mt-1'>
                  <span className='text-xs text-red-600'>-{lowStock}</span>
                  <TrendingDown className='w-3 h-3 text-red-600 ml-1' />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Stock Levels */}
          <div>

          </div>
        </div>
      </main>
    </div>
  )
}
