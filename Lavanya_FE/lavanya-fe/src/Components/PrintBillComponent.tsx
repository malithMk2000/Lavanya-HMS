import { useEffect, useState } from "react"
import html2pdf from "html2pdf.js"

interface BookingItem {
  itemId: number
  itemName: string
  quantity: number
  price: number
  subtotal: number
}

interface BookingDetails {
  id: number
  userId: number
  customerName: string
  phoneNumber: string
  address: string
  isFullPaid: boolean
  totalPayment: number
  advancedPayment: number
  deductionAmount: number
  securityDeposit: number
  remainingPayment: number
  items: BookingItem[]
  createdAt: string
}

interface PrintBillComponentProps {
  bookingId: number
  onClose: () => void
}

export default function PrintBillComponent({ bookingId, onClose }: PrintBillComponentProps) {
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookingDetails()
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`https://localhost:7151/api/Booking/${bookingId}`)
      if (!response.ok) throw new Error("Failed to fetch booking details")
      const data = await response.json()
      setBooking(data)
    } catch (error) {
      console.error("Error fetching booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const element = document.getElementById("bill-content");
    if (!element) return;

    // Store original styles
    const originalStyles = new Map<HTMLElement, string>();
    const originalOverflow = element.style.overflow;
    const originalMaxHeight = element.style.maxHeight;
    
    // Remove scrolling constraints for PDF generation
    element.style.overflow = 'visible';
    element.style.maxHeight = 'none';
    
    // Apply RGB colors to avoid oklch parsing errors
    const applyRgbColors = (el: HTMLElement) => {
      originalStyles.set(el, el.style.cssText);
      
      // Replace problematic Tailwind colors with RGB equivalents
      if (el.classList.contains('bg-yellow-50')) el.style.backgroundColor = 'rgb(254, 252, 232)';
      if (el.classList.contains('bg-yellow-500')) el.style.backgroundColor = 'rgb(234, 179, 8)';
      if (el.classList.contains('border-yellow-500')) el.style.borderColor = 'rgb(234, 179, 8)';
      if (el.classList.contains('border-yellow-600')) el.style.borderColor = 'rgb(202, 138, 4)';
      if (el.classList.contains('text-yellow-500')) el.style.color = 'rgb(234, 179, 8)';
      if (el.classList.contains('bg-green-100')) el.style.backgroundColor = 'rgb(220, 252, 231)';
      if (el.classList.contains('border-green-500')) el.style.borderColor = 'rgb(34, 197, 94)';
      if (el.classList.contains('text-green-600')) el.style.color = 'rgb(22, 163, 74)';
      if (el.classList.contains('text-green-800')) el.style.color = 'rgb(22, 101, 52)';
      if (el.classList.contains('text-red-600')) el.style.color = 'rgb(220, 38, 38)';
      if (el.classList.contains('text-blue-600')) el.style.color = 'rgb(37, 99, 235)';
      if (el.classList.contains('bg-gray-50')) el.style.backgroundColor = 'rgb(249, 250, 251)';
      if (el.classList.contains('bg-gray-100')) el.style.backgroundColor = 'rgb(243, 244, 246)';
      if (el.classList.contains('text-gray-500')) el.style.color = 'rgb(107, 114, 128)';
      if (el.classList.contains('text-gray-600')) el.style.color = 'rgb(75, 85, 99)';
      if (el.classList.contains('text-gray-700')) el.style.color = 'rgb(55, 65, 81)';
      if (el.classList.contains('text-black')) el.style.color = 'rgb(0, 0, 0)';
      if (el.classList.contains('border')) el.style.borderColor = 'rgb(229, 231, 235)';
      
      // Recursively process children
      Array.from(el.children).forEach(child => applyRgbColors(child as HTMLElement));
    };
    
    // Apply RGB colors before PDF generation
    applyRgbColors(element);

    // Use a small delay to ensure styles are applied
    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `Booking_${booking?.id}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            windowHeight: element.scrollHeight,
            height: element.scrollHeight
          },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        })
        .from(element)
        .save()
        .then(() => {
          // Restore original styles after PDF generation
          element.style.overflow = originalOverflow;
          element.style.maxHeight = originalMaxHeight;
          originalStyles.forEach((style, el) => {
            el.style.cssText = style;
          });
        })
        .catch((err) => {
          console.error("PDF download error:", err);
          // Restore original styles even on error
          element.style.overflow = originalOverflow;
          element.style.maxHeight = originalMaxHeight;
          originalStyles.forEach((style, el) => {
            el.style.cssText = style;
          });
        });
    }, 200);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-lg">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-lg text-red-600">Booking not found</p>
          <button
            onClick={onClose}
            className="mt-4 bg-black text-yellow-500 px-4 py-2 rounded hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 relative">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-4 border-b sticky top-0 bg-white z-50 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            🖨️ Print Bill
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            📥 Download PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 font-semibold"
          >
            Close
          </button>
        </div>

        {/* Scrollable Bill Content */}
        <div id="bill-content" className="p-8 overflow-y-auto max-h-[80vh]">
          {/* Header */}
          <div className="text-center mb-8 border-b-4 border-yellow-500 pb-6">
            <h1 className="text-4xl font-bold text-black mb-2">Lavanya Wedding and Banquet Hall</h1>
            <p className="text-gray-600 text-lg">Booking Invoice</p>
            <p className="text-sm text-gray-500 mt-2">
              Booking ID: #{booking.id} | Date: {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Customer Details */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-black border-b-2 border-yellow-500 pb-2">
              Customer Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-semibold text-lg">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="font-semibold text-lg">{booking.phoneNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-semibold text-lg">{booking.address}</p>
              </div>
            </div>
          </div>

          {/* Booking Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-black border-b-2 border-yellow-500 pb-2">
              Booking Items
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">#</th>
                  <th className="border p-3 text-left">Item Name</th>
                  <th className="border p-3 text-center">Quantity</th>
                  <th className="border p-3 text-right">Unit Price (Rs.)</th>
                  <th className="border p-3 text-right">Subtotal (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {booking.items.map((item, index) => (
                  <tr key={item.itemId} className="hover:bg-gray-50">
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3 font-semibold">{item.itemName}</td>
                    <td className="border p-3 text-center">{item.quantity}</td>
                    <td className="border p-3 text-right">{item.price.toFixed(2)}</td>
                    <td className="border p-3 text-right font-semibold">{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-500">
            <h2 className="text-xl font-bold mb-4 text-black">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Total Payment:</span>
                <span className="font-bold">Rs. {booking.totalPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Deduction Amount:</span>
                <span className="font-semibold text-red-600">- Rs. {booking.deductionAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Advanced Payment:</span>
                <span className="font-semibold text-green-600">Rs. {booking.advancedPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Security Deposit:</span>
                <span className="font-semibold text-blue-600">Rs. {booking.securityDeposit.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-yellow-600 pt-3 mt-3">
                <div className="flex justify-between text-xl">
                  <span className="font-bold text-black">Remaining Payment:</span>
                  <span className="font-bold text-red-600">Rs. {booking.remainingPayment.toFixed(2)}</span>
                </div>
              </div>
              {booking.isFullPaid && (
                <div className="bg-green-100 border-2 border-green-500 p-3 rounded mt-4 text-center">
                  <p className="text-green-800 font-bold text-lg">✓ FULLY PAID</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-600 text-sm border-t pt-4">
            <p>Thank you for choosing Lavanya Wedding and Banquet Hall!</p>
            <p className="mt-2">For inquiries, please contact us at your convenience.</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #bill-content, #bill-content * { visibility: visible; }
          #bill-content { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}