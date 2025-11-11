export default function NotificationsPage() {
  const notifications = [
    { id: 1, title: "Congratulations! You've earned a new badge", desc: "Extension: Level 1", time: "1 min ago" },
    { id: 2, title: "Congratulations! You've achieved Bronze status", time: "1 min ago" },
    { id: 3, title: "Congratulations! You've achieved Bronze status", time: "1 min ago" },
    {
      id: 4,
      title: "Congratulations! You've earned a new badge",
      desc: "Profile: Registration Validated",
      time: "1 min ago",
    },
    { id: 5, title: "You've received a $1 bonus for installation", time: "1 min ago" },
  ]

  return (
    <div className="px-4 py-6 space-y-6">
      {/* <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Notifications</h2>
      </div> */}

      <p className="text-lg font-bold">6 unread notifications</p>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              i
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notif.title}</p>
              {notif.desc && <p className="text-xs text-gray-600">{notif.desc}</p>}
              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
