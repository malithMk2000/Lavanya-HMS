import { useEffect, useState } from "react"

interface Item {
  id: number
  name: string
  price: number
  isActive?: boolean
}

interface BillingItemsSectionProps {
  userId: number
  onBack: () => void
  onBookingSaved: (bookingId: number) => void 
}

export default function BillingItemsSection({ userId, onBack, onBookingSaved }: BillingItemsSectionProps) {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<
    { id: number; name: string; price: number; quantity: number }[]
  >([])
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const [isFullPaid, setIsFullPaid] = useState(false)
  const [totalPayment, setTotalPayment] = useState(0)
  const [advancedPayment, setAdvancedPayment] = useState(0)
  const [deductionAmount, setDeductionAmount] = useState(0)
  const [securityDeposit, setSecurityDeposit] = useState(0)

  // Fetch active items on mount
  useEffect(() => {
    fetch("https://localhost:7151/api/Items")
      .then((res) => res.json())
      .then((data) => {
        const activeItems = data.filter((item: Item) => item.isActive !== false)
        setItems(activeItems)
      })
      .catch((err) => console.error("Error fetching items:", err))
  }, [])

  // Update total payment
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotalPayment(total)
  }, [selectedItems])

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

  const saveBill = async () => {
    if (selectedItems.length === 0) {
      setMessage("No items selected!")
      return
    }

    if (totalPayment <= 0) {
      setMessage("Total payment must be greater than 0!")
      return
    }

    setIsSaving(true)
    setMessage("")

    const payload = {
      userId: userId,
      isFullPaid: isFullPaid,
      totalPayment: Number(totalPayment),
      advancedPayment: Number(advancedPayment),
      deductionAmount: Number(deductionAmount),
      securityDeposit: Number(securityDeposit),
      items: selectedItems.map((i) => ({ itemId: i.id, quantity: i.quantity })),
    }

    console.log("Sending payload:", payload)

    try {
      const response = await fetch("https://localhost:7151/api/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error("Failed to save booking")
      }

      const data = await response.json()
      const bookingId = Number(data.bookingId) // Ensure it's a number
      console.log("Booking saved with ID:", bookingId)

      setMessage("Booking saved successfully! 🎉")

      // ✅ Trigger redirect to PrintBillComponent
      onBookingSaved(bookingId)

      // Reset form if needed
      setSelectedItems([])
      setIsFullPaid(false)
      setTotalPayment(0)
      setAdvancedPayment(0)
      setDeductionAmount(0)
      setSecurityDeposit(0)

    } catch (error) {
      console.error("Save booking error:", error)
      setMessage("Error saving booking ❌")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
      >
        ← Back to User Details
      </button>

      <h2 className="text-lg font-bold mb-4 text-black">Billing - Select Items</h2>
      <p className="mb-4 text-gray-600">User ID: {userId}</p>

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
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                      className="w-16 border rounded p-1"
                      min="1"
                    />
                  </td>
                  <td className="p-2 border">Rs. {item.price}</td>
                  <td className="p-2 border">Rs. {item.price * item.quantity}</td>
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

          <div className="mt-6 border-t pt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-semibold">Total Payment</label>
              <input
                type="number"
                value={totalPayment}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">Advanced Payment</label>
              <input
                type="number"
                value={advancedPayment}
                onChange={(e) => setAdvancedPayment(Number(e.target.value))}
                className="w-full border rounded p-2"
                min="0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">Deduction Amount</label>
              <input
                type="number"
                value={deductionAmount}
                onChange={(e) => setDeductionAmount(Number(e.target.value))}
                className="w-full border rounded p-2"
                min="0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">Security Deposit</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full border rounded p-2"
                min="0"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFullPaid}
                  onChange={(e) => setIsFullPaid(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-semibold">Full Payment Received</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={saveBill}
              disabled={isSaving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSaving ? "Saving..." : "Save Booking & Print"}
            </button>
          </div>

          {message && (
            <p className="mt-3 text-center font-semibold text-black">{message}</p>
          )}
        </div>
      )}
    </div>
  )
}
