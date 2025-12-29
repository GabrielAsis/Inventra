import Pagination from '@/components/pagination';
import Sidebar from '@/components/sidebar'
import { deleteProduct } from '@/lib/actions/products';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma'
import { CaseSensitive, Search } from 'lucide-react';
import React from 'react'

export default async function InventoryPage({ searchParams, }: {
  searchParams: Promise<{ q?: string, page?: string }>;
}) {
  const user = await getCurrentUser()
  const userId = user.id;

  const params = await searchParams
  const q = (params.q ?? "").trim();

  const pageSize = 6;

  const page = Math.max(1, Number(params.page ?? 1));

  const where = {
    userId,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  }

  const totalProducts = await prisma.product.findMany({ where, });

  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where }), await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className='min-h-screen bg-zinc-50'>
      <Sidebar currentPath='/inventory' />
      <main className='ml-64 p-8'>
        <div className='mb-8'>
          <div className="flex items-center justify-between">
            <div>
              <h1 className='text-2xl font-semibold text-zinc-900'>Inventory</h1>
              <p>Manage your porducts and tack your inventory levels.</p>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* SEARCH */}
          <div className='bg-white rounded-lg border-zinc-200 p-6'>
            <form action="/inventory" className='flex' method='GET'>
              <input name='q' placeholder='Search Products..' className='flex-1 px-4 py-2 border border-zinc-300 rounded-lg rounded-tr-none rounded-br-none focus:border-transparent border-r-transparent' />
              <button className='p-3 bg-green-500 text-white rounded-lg rounded-tl-none rounded-bl-none hover:bg-green-700 hover:cursor-pointer'><Search size={18} strokeWidth={3} /></button>
            </form>
          </div>

          {/* PRODUCTS TABLE */}
          <div className='bg-white rounded-lg border border-zinc-200 overflow-hidden'>
            <table className='w-full'>
              <thead className='bg-zinc-50'>
                <tr>
                  <th className='px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase'>Name</th>
                  <th className='px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase'>SKU</th>
                  <th className='px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase'>Price</th>
                  <th className='px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase'>Quantity</th>
                  <th className='px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase'>Low Stock</th>
                  <th className='px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase'>Actions</th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-zinc-200'>
                {items.map((product, key) => (
                  <tr key={key} className='hover:bg-zinc-50'>
                    <td className='px-5 py-4 text-sm text-zinc-500 '>{product.name}</td>
                    <td className='px-5 py-4 text-sm text-zinc-500 '>{product.sku || "-"}</td>
                    <td className='px-5 py-4 text-sm text-zinc-500 '>${Number(product.price).toFixed(2)}</td>
                    <td className='px-5 py-4 text-sm text-zinc-500 '>{product.quantity}</td>
                    <td className='px-5 py-4 text-sm text-zinc-500 '>{product.lowStockAt || "-"}</td>
                    <td className='px-5 py-4 text-sm text-zinc-500 '>
                      <form action={async (formData: FormData) => {
                        "use server";
                        await deleteProduct(formData);
                      }}>
                        <input type="hidden" name='id' value={product.id} />
                        <button className='text-red-600 hover:text-red-900 hover:cursor-pointer'>Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 &&
            <div className='bg-white rounded-lg border border-zinc-200 p-6'>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl='/inventory'
                searchParams={{
                  q,
                  pageSize: String(pageSize),
                }}
              />
            </div>}
        </div>
      </main>
    </div>
  )
}
