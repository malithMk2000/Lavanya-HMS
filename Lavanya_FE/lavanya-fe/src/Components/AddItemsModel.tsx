// src/components/AddItemModal.tsx
import React, { useState } from "react"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const [itemName, setItemName] = useState("")
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleAdd = async () => {
    if (!itemName || !price) {
      setError("Please fill both fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://localhost:7151/api/Items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: itemName,
          price: Number(price),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item")
      }

      // Success
      console.log("Item added successfully")
      setItemName("")
      setPrice("")
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-center">Add Items</h2>

        {/* Error message */}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-black text-yellow-500 font-semibold hover:bg-gray-900"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  )
}
