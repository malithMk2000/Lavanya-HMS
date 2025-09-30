import { useState } from "react"
import BillingItemsSection from "./BillingItemsSection"

interface UserData {
  firstName: string
  lastName: string
  address: string
  phoneNo: string
  nic: string
  email: string
}

export default function BillingSection() {
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    address: "",
    phoneNo: "",
    nic: "",
    email: "",
  })

  const [userId, setUserId] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleNext = async () => {
    try {
      const response = await fetch("https://localhost:7151/api/Users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save user details")

      const result = await response.json()
      console.log("User saved:", result)
      setUserId(result.id) // ✅ save userId
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  // ✅ if userId exists, go to BillingItemsSection
  if (userId) {
    return <BillingItemsSection userId={userId} />
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-lg font-bold mb-4 text-black">Billing - User Details</h2>

      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="firstName" placeholder="First Name"
          value={formData.firstName} onChange={handleChange}
          className="border p-2 rounded" />
        <input type="text" name="lastName" placeholder="Last Name"
          value={formData.lastName} onChange={handleChange}
          className="border p-2 rounded" />
        <input type="text" name="address" placeholder="Address"
          value={formData.address} onChange={handleChange}
          className="border p-2 rounded col-span-2" />
        <input type="text" name="phoneNo" placeholder="Phone Number"
          value={formData.phoneNo} onChange={handleChange}
          className="border p-2 rounded" />
        <input type="text" name="nic" placeholder="NIC"
          value={formData.nic} onChange={handleChange}
          className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange}
          className="border p-2 rounded col-span-2" />
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={handleNext}
          className="bg-black text-yellow-500 px-6 py-2 rounded-lg hover:bg-gray-900">
          Next
        </button>
      </div>
    </div>
  )
}
