// src/pages/AdminPage.tsx
import { useState } from "react"
import AddItemModal from "../Components/AddItemsModel"
import BillingSection from "../Components/BillingSection"

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userData, setUserData] = useState(null)

  const handleUserSaved = (data: any) => {
    setUserData(data)
    console.log("User data stored:", data)
    // 👉 After this, you will move to booking items section
  }


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-yellow-500 p-4">
        <h1 className="text-xl font-bold">Lavanya Management Portal</h1>
      </header>

      {/* Body */}
      <main className="p-6">
        {/* Top-right Add Items button */}
        <div className="flex justify-end">
          <button
            className="bg-black text-yellow-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-900"
            onClick={() => setIsModalOpen(true)} // 👈 open modal
          >
            Add Items
          </button>
        </div>
        <BillingSection onNext={handleUserSaved} />
      </main>

      {/* Modal (shows only if isModalOpen = true) */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 👈 close modal
      />
    </div>
  )
}
