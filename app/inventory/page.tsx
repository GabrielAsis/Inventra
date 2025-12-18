import Sidebar from '@/components/sidebar'
import { deleteProduct } from '@/lib/actions/products';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function InventoryPage({ }) {
  const user = await getCurrentUser()
  const userId = user.id;
  const totalProducts = await prisma.product.findMany({ where: { userId } });


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
          {/* PRODUCTS TABLE */}
          <div className='bg-white rounded-lg border border-zinc-200 overlfow-hidden'>
            <table className='w-full'>
              <thead className='bg-zinc-50'>
                <tr>
                  <th className='px-6 py-6 text-left text-xs font-medium text-zinc-500 uppercase'>Name</th>
                  <th className='px-6 py-6 text-left text-xs font-medium text-zinc-500 uppercase'>SKU</th>
                  <th className='px-6 py-6 text-left text-xs font-medium text-zinc-500 uppercase'>Price</th>
                  <th className='px-6 py-6 text-left text-xs font-medium text-zinc-500 uppercase'>Quantity</th>
                  <th className='px-6 py-6 text-left text-xs font-medium text-zinc-500 uppercase'>Low Stock</th>
                  <th className='px-6 py-6 text-left text-xs font-medium text-zinc-500 uppercase'>Actions</th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-zinc-200'>
                {totalProducts.map((product, key) => (
                  <tr key={key} className='hover:bg-zinc-50'>
                    <td className='px-6 py-4 text-sm text-zinc-500 '>{product.name}</td>
                    <td className='px-6 py-4 text-sm text-zinc-500 '>{product.sku || "-"}</td>
                    <td className='px-6 py-4 text-sm text-zinc-500 '>${Number(product.price).toFixed(2)}</td>
                    <td className='px-6 py-4 text-sm text-zinc-500 '>{product.quantity}</td>
                    <td className='px-6 py-4 text-sm text-zinc-500 '>{product.lowStockAt || "-"}</td>
                    <td className='px-6 py-4 text-sm text-zinc-500 '>
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
        </div>
      </main>
    </div>
  )
}
