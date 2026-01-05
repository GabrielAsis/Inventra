import Sidebar from "@/components/sidebar"
import { createProduct } from "@/lib/actions/products"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"

export default async function AddProductPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar currentPath="/add-product" />

      <main className="ml-64 p-8">
        <div className='mb-8'>
          <div className="flex items-center justify-between">
            <div>
              <h1 className='text-2xl font-semibold text-zinc-900'>Add Product</h1>
              <p>Add a new product to your inventory.</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <form className="space-y-6" action={createProduct}>

              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 mb-2">
                  Product Name *
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg foucs:border-transparent"
                  placeholder="Enter Product Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QUANTITY */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-zinc-700 mb-2">
                    Product Quantity *
                  </label>

                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg foucs:border-transparent"
                    placeholder="0.0"
                  />
                </div>

                {/* PRICE */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-zinc-700 mb-2">
                    Product Price *
                  </label>

                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg foucs:border-transparent"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {/* SKU */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 mb-2">
                  Product SKU *
                </label>

                <input
                  type="text"
                  id="skue"
                  name="skue"
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg foucs:border-transparent"
                  placeholder="Enter SKU"
                />
              </div>

              {/* LOW STOCK AT */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-zinc-700 mb-2">
                  Low Stock At (optional)
                </label>

                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg foucs:border-transparent"
                  placeholder="0.0"
                />
              </div>

              <div className="flex gap-5">
                <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm hover:cursor-pointer">Add Product</button>
                <Link href="/inventory" className="px-6 py-3 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300 text-sm">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
