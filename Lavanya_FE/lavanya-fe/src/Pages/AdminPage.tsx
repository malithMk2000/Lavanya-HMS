import { useState } from "react"
import AddItemModal from "../Components/AddItemsModel"
import ManageItemsModal from "../Components/ManageItemsModel"
import BillingSection from "../Components/BillingSection"
import BillingItemsSection from "../Components/BillingItemsSection"
import PrintBillComponent from "../Components/PrintBillComponent"

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [step, setStep] = useState<"user" | "items" | "print">("user")
  const [savedUser, setSavedUser] = useState<any>(null)
  const [renderKey, setRenderKey] = useState(0)
  const [bookingId, setBookingId] = useState<number | null>(null) // ✅ Store booking ID

  // Called when user details are saved/updated
  const handleUserSaved = (user: any) => {
    console.log("User saved:", user) // Debug log
    setSavedUser(user)
    setStep("items") // move to billing items
  }

  // Go back to user details page
  const handleBack = () => {
    console.log("Going back, savedUser:", savedUser) // Debug log
    setRenderKey(prev => prev + 1) // ✅ Force component remount
    setStep("user")
  }

  // ✅ Handle successful booking save
  const handleBookingSaved = (id: number) => {
    setBookingId(id)
    setStep("print")
  }

  // ✅ Close print bill and reset to user details
  const handleClosePrintBill = () => {
    setStep("user")
    setSavedUser(null)
    setBookingId(null)
    setRenderKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-yellow-500 p-4">
        <h1 className="text-xl font-bold">Lavanya Management Portal</h1>
      </header>

      <main className="p-6">
        <div className="flex justify-end gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            onClick={() => setIsManageModalOpen(true)}
          >
            Manage Items
          </button>
          <button
            className="bg-black text-yellow-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-900"
            onClick={() => setIsModalOpen(true)}
          >
            Add Items
          </button>
        </div>

        {step === "user" && (
          <BillingSection
            key={`user-${renderKey}-${savedUser?.id || "new"}`} // ✅ Dynamic key that changes on back
            onNext={handleUserSaved}
            initialData={savedUser}
          />
        )}

        {step === "items" && savedUser && (
          <BillingItemsSection
            userId={savedUser.id}
            onBack={handleBack}
            onBookingSaved={handleBookingSaved} // ✅ Pass callback
          />
        )}

        {step === "print" && bookingId && (
          <PrintBillComponent
            bookingId={bookingId}
            onClose={handleClosePrintBill}
          />
        )}
      </main>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ManageItemsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
      />
    </div>
  )
}