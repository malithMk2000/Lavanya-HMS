import { useEffect, useState } from "react"

interface Item {
  id: number
  name: string
  price: number
  isActive: boolean
}

interface ManageItemsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ManageItemsModal({ isOpen, onClose }: ManageItemsModalProps) {
  const [items, setItems] = useState<Item[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: "", price: 0 })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (isOpen) {
      fetchItems()
    }
  }, [isOpen])

  const fetchItems = async () => {
    try {
      const response = await fetch("https://localhost:7151/api/Items")
      const data = await response.json()
      // Show all items (both active and inactive)
      setItems(data)
    } catch (error) {
      console.error("Error fetching items:", error)
    }
  }

  const startEdit = (item: Item) => {
    setEditingId(item.id)
    setEditForm({ name: item.name, price: item.price })
    setMessage("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: "", price: 0 })
  }

  const saveEdit = async (id: number) => {
    if (!editForm.name.trim() || editForm.price <= 0) {
      setMessage("Please enter valid name and price")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(`https://localhost:7151/api/Items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          name: editForm.name,
          price: editForm.price,
          isActive: true,
        }),
      })

      if (!response.ok) throw new Error("Failed to update item")

      setMessage("Item updated successfully! ✅")
      setEditingId(null)
      fetchItems() // Refresh the list
    } catch (error) {
      console.error("Error updating item:", error)
      setMessage("Error updating item ❌")
    } finally {
      setLoading(false)
    }
  }

  const toggleItemStatus = async (id: number, currentStatus: boolean) => {
    const action = currentStatus ? "deactivate" : "activate"
    if (!confirm(`Are you sure you want to ${action} this item?`)) return

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(`https://localhost:7151/api/Items/${id}/toggle`, {
        method: "PUT",
      })

      if (!response.ok) throw new Error(`Failed to ${action} item`)

      setMessage(`Item ${action}d successfully! ✅`)
      fetchItems() // Refresh the list
    } catch (error) {
      console.error(`Error ${action}ing item:`, error)
      setMessage(`Error ${action}ing item ❌`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">Manage Items</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
            {message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border text-left">Item Name</th>
                <th className="p-3 border text-left">Price (Rs.)</th>
                <th className="p-3 border text-center">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${!item.isActive ? 'bg-gray-100 opacity-60' : ''}`}>
                    {editingId === item.id ? (
                      <>
                        <td className="p-3 border">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="w-full border rounded p-2"
                            placeholder="Item name"
                          />
                        </td>
                        <td className="p-3 border">
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full border rounded p-2"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="p-3 border text-center">
                          <span className={`px-2 py-1 rounded text-sm ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3 border text-center">
                          <button
                            onClick={() => saveEdit(item.id)}
                            disabled={loading}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2 disabled:bg-gray-400"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={loading}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 border">{item.name}</td>
                        <td className="p-3 border">Rs. {item.price.toFixed(2)}</td>
                        <td className="p-3 border text-center">
                          <span className={`px-2 py-1 rounded text-sm ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3 border text-center">
                          <button
                            onClick={() => startEdit(item)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2 disabled:bg-gray-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleItemStatus(item.id, item.isActive)}
                            disabled={loading}
                            className={`${
                              item.isActive 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            } text-white px-3 py-1 rounded disabled:bg-gray-400`}
                          >
                            {item.isActive ? 'Delete' : 'Activate'}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-black text-yellow-500 px-6 py-2 rounded-lg hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}