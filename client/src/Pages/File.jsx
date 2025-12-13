import React, { useState } from 'react'

const mockInventory = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    unitPrice: 2500,
    quantity: 25,
    category: "Electronics"
  },
  {
    id: 2,
    name: "USB-C Charging Cable",
    unitPrice: 500,
    quantity: 150,
    category: "Electronics"
  },
  {
    id: 3,
    name: "Office Desk Chair",
    unitPrice: 15000,
    quantity: 8,
    category: "Furniture"
  },
  {
    id: 4,
    name: "Notebook A5 (Pack of 5)",
    unitPrice: 750,
    quantity: 60,
    category: "Stationery"
  },
  {
    id: 5,
    name: "Ballpoint Pens (Box of 12)",
    unitPrice: 300,
    quantity: 100,
    category: "Stationery"
  },
  {
    id: 6,
    name: "Laptop Stand",
    unitPrice: 3500,
    quantity: 20,
    category: "Electronics"
  },
  {
    id: 7,
    name: "Printer Paper (500 sheets)",
    unitPrice: 1200,
    quantity: 45,
    category: "Office Supplies"
  },
  {
    id: 8,
    name: "Wireless Mouse",
    unitPrice: 1800,
    quantity: 35,
    category: "Electronics"
  },
  {
    id: 9,
    name: "Desk Lamp LED",
    unitPrice: 2200,
    quantity: 15,
    category: "Furniture"
  },
  {
    id: 10,
    name: "Whiteboard Markers (Set of 8)",
    unitPrice: 450,
    quantity: 80,
    category: "Stationery"
  }
]

export default function File() {
  const [inventoryItems, setInventoryItems] = useState(mockInventory)
  const [sales, setSales] = useState([])
  const [formData, setFormData] = useState({
    items:
      [
        {
          inventoryItem: "",
          name: "",
          quantity: 1,
          unitPrice: ""
        }],
    customerName: '',
    totalAmount: '',
    paymentStatus: '',
    paymentMethod: '',

  })

  const addItems = () => {
    setFormData({
      ...formData, items: [...formData.items, { name: "", quantity: 1, unitPrice: "", inventoryItem: "" }]
    })
  }

  const removeItem = (index) => {
    const newItem = formData.items.filter((_, i) => i !== index)

    setFormData({ ...formData, items: newItem })

  }
  // https://auth-fawn-eight.vercel.app

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value

    if (field === 'inventoryItem' && value) {
      const findItem = inventoryItems.find((i) => i === value)
      if (findItem) {
        newItems[index].name = newItems.name
      }
    }
    setFormData({ ...formData, items: newItems })
  }

  return (
    <div className='max-w-2xl mx-auto min-h-screen bg-red-500 p-4'>
      {/* add items section */}

      <div className="max-w-xl bg-amber-400 space-y-2 ">
        <p>items</p>
        {
          formData.items.map((item, index) => (
            <div className="flex gap-2" key={index}>
              <select value={item.inventoryItem}
                onChange={(e) => updateItem(index, 'inventoryItem', e.target.value)}
              >
                <option value="Select">Select</option>
                {inventoryItems.map((inv) => (
                  <option value={inv.id} key={inv.id}>{inv.name}</option>
                ))
                }
              </select>
              <input className='w-8 h-8 bg-white' type='number' value={item.quantity}
                onChange={(e) => updateItem(index, 'quantiy', e.target.value)}
              />
              <input className='w-8 h-8 bg-white' type='number' value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
              />

              {
                formData.items.length > 1 && (<button onClick={() => removeItem(index)}>x</button>)
              }
            </div>
          ))
        }
        <button className='text-sm ' onClick={() => addItems()} >add another item</button>
      </div>
    </div>
  )
}
