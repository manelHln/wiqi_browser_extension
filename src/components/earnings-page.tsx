const PaymentInfoCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        Once you have accumulated $20 in validated earnings, you can request payment by bank transfer, PayPal or gift voucher.
      </p>
      <button className="w-full bg-primary text-white font-semibold py-2 rounded-full transition">
          Request Payment
        </button>
    </div>
  );
};

export default function EarningsPage() {
  const transactions = [
    {
      id: 1,
      name: "Extension install",
      date: "05/11/2025",
      amount: "1$",
      status: "Validated"
    },
    {
      id: 2,
      name: "Welcome Gift",
      date: "04/11/2025",
      amount: "10$",
      status: "Validated"
    },
    {
      id: 3,
      name: "Sephora Cashback",
      date: "03/11/2025",
      amount: "5$",
      status: "Pending"
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="bg-secondary text-white p-6 space-y-2">
        <div>
          <p className="text-sm opacity-90">Your wiqi wallet</p>
          <h3 className="text-4xl font-bold">11$</h3>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            11$ validated
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            0$ pending
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 mt-[-20px] max-w-2xl mx-auto">
      <PaymentInfoCard />
      <div className="px-4 max-w-2xl mx-auto mb-4">
        <h3 className="text-lg font-bold">Activity</h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm">{tx.name}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{tx.amount}</p>
                <p
                  className={`text-xs ${tx.status === "Validé" ? "text-green-600" : "text-gray-500"}`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
