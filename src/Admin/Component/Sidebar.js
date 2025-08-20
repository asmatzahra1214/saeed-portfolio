import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaVideo, 
  FaCalendarAlt,
  FaChevronRight,
  FaEnvelope,
} from 'react-icons/fa';

const Sidebar = () => {
  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt className="text-sky-500" /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers className="text-sky-500" /> },
    { path: "/admin/videos", label: "Videos", icon: <FaVideo className="text-sky-500" /> },
    { path: "/admin/appointments", label: "Appointments", icon: <FaCalendarAlt className="text-sky-500" /> },
    { path: "/admin/contacts", label: "Messages", icon: <FaEnvelope className="text-sky-500" /> },
    { path: "/admin/home", label: "home", icon: <FaEnvelope className="text-sky-500" /> }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-black">
          <span className="text-sky-500">Admin</span> Panel
        </h1>
        <p className="text-xs text-gray-500 mt-1">Management Console</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-sky-50 text-sky-600 font-medium border-l-4 border-sky-500' 
                      : 'text-gray-700 hover:bg-sky-50 hover:text-sky-600'
                  }`
                }
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <FaChevronRight className="text-xs text-gray-400" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
            <span className="text-xs font-bold">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium text-black">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;