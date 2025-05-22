"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'

const categories = {
  men: ["polo", "tshirt", "jean", "accessories", "shoes"],
  women: ["dress", "heels", "bags", "accessories", "tops"],
  boy: ["shorts", "tshirt", "shoes", "cap", "hoodie"],
  girl: ["dress", "shoes", "headband", "leggings", "tops"],
};

function Page({ params }) {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')
  const category = params.category

  // Get the subcategories for the current category
  const subcategories = categories[category] || []

  // Sample product data
  const products = [
    { id: 1, name: 'Polo Shirt', category: 'polo' },
    { id: 2, name: 'T-Shirt', category: 'tshirt' },
    // ... more products
  ]

  // Filter products based on the filter parameter
  const filteredProducts = filter 
    ? products.filter(product => product.category === filter)
    : products

  return (
    <>
      <div>
        <div className='w-full flex'>
          {subcategories.map((subcategory, index) => (
            <a 
              key={index}
              href={`?filter=${subcategory}`}
              className='w-[20%] flex items-center justify-center'
            >
              {subcategory}
            </a>
          ))}
        </div>
        
        {/* Display filtered products */}
        <div className="mt-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="p-2 border-b">
              {product.name}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Page