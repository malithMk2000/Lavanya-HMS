import { useEffect, useState } from "react"

interface Item {
  id: number
  name: string
  price: number
}

interface BillingItemsSectionProps {
  userId: number
}

export default function BillingItemsSection({ userId }: BillingItemsSectionProps) {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<
    { id: number; name: string; price: number; quantity: number }[]
  >([])

  useEffect(() => {
    fetch("https://localhost:7151/api/Items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err))
  }, [])

  const addItem = (item: Item) => {
    const existing = selectedItems.find((i) => i.id === item.id)
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    setSelectedItems(
      selectedItems.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    )
  }

  const removeItem = (id: number) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== id))
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-lg font-bold mb-4 text-black">Billing - Select Items</h2>
      <p className="mb-4 text-gray-600">User ID: {userId}</p>

      {/* Items list */}
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-lg hover:shadow cursor-pointer"
            onClick={() => addItem(item)}
          >
            <p className="font-semibold">{item.name}</p>
            <p>Rs. {item.price}</p>
          </div>
        ))}
      </div>

      {/* Selected items table */}
      {selectedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Selected Items</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Subtotal</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, Number(e.target.value))
                      }
                      className="w-16 border rounded p-1"
                      min="1"
                    />
                  </td>
                  <td className="p-2 border">Rs. {item.price}</td>
                  <td className="p-2 border">
                    Rs. {item.price * item.quantity}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
