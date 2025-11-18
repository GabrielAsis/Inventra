import ProductsChart from '@/components/products-chart';
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

  const now = new Date()
  const weeklyProductsData = []

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")}/${String(weekStart.getDate() + 1).padStart(2, "0")}`

    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt)
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductsData.push({
      week: weekLabel,
      products: weekProducts.length,
    })
  }

  const recent = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalValue = allProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.quantity), 0);

  const inStockCount = allProducts.filter((p) => Number(p.quantity) > 5).length
  const lowStockCount = allProducts.filter((p) => Number(p.quantity) <= 5 && Number(p.quantity) >= 1).length
  const outOfStockCount = allProducts.filter((p) => Number(p.quantity) === 0).length

  const inStockPercentage = totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPercentage = totalProducts > 0 ? Math.round((lowStock / totalProducts) * 100) : 0;
  const outOfStockPercentage = totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;


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

        {/* Grid 1*/}
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

          {/* Inventory graph */}
          <div className='bg-white rounded-lg border border-zinc-200 p-6'>
            <div className="flex items-center justify-between mb-6">
              <h2>New products per week</h2>
            </div>
            <div className='h-48'>
              <ProductsChart data={weeklyProductsData} />
            </div>
          </div>
        </div>

        {/* Grid 2 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Stock Levels */}
          <div className='bg-white rounded-lg border border-zinc-200 p-6'>
            <div className='flex itmes-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-zinc-900'>Stock Levels</h2>
            </div>
            <div className='space-y-3'>
              {recent.map((product, key) => {
                // checks stock level
                const stockLevel = product.quantity === 0
                  ? 0
                  : product.quantity <= (product.lowStockAt || 5)
                    ? 1
                    : 2;

                // color array based on stock level
                const bgColors = [
                  "bg-red-500",
                  "bg-yellow-500",
                  "bg-green-500",
                ]
                const textColors = [
                  "text-red-500",
                  "text-yellow-500",
                  "text-green-500",
                ]
                return (
                  <div key={key} className='flex items-center justify-between p-3 rounded-lg bg-zinc-50'>
                    <div className='flex items-center space-x-3'>
                      <div className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`} />
                      <span className='text-sm font-medium text-zinc-'>{product.name}</span>
                    </div>
                    <div className={`text-sm font-medium ${textColors[stockLevel]}`}>{product.quantity} units</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Efficiency Pie Chart */}
          <div className='bg-white rounded-lg border border-zinc-200 p-6'>
            <div className='felx items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-zinc-900'>Efficiency</h2>
            </div>
            <div className='flex items-center justify-center'>
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-green-400"
                  style={{
                    clipPath:
                      "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {inStockPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">In Stock</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-6 space-y-2'>
              <div className='flex items-center justify-between text-sm text-zinc-600'>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-green-400' />
                  <span>In Stock ({inStockPercentage})%</span>
                </div>
              </div>
              <div className='flex items-center justify-between text-sm text-zinc-600'>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-green-200' />
                  <span>Low Stock ({lowStockPercentage})%</span>
                </div>
              </div>
              <div className='flex items-center justify-between text-sm text-zinc-600'>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-zinc-200' />
                  <span>Out of Stock ({outOfStockPercentage})%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
