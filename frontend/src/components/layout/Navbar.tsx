import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Clubs', href: '/clubs', icon: BuildingOffice2Icon },
  { name: 'Players', href: '/players', icon: UserGroupIcon },
  { name: 'Coaches', href: '/coaches', icon: AcademicCapIcon },
]

export function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                Sportian
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navigation.map((item) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      transition-colors duration-200
                      ${isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const isActive = item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg
                  ${isActive
                    ? 'text-primary-600'
                    : 'text-gray-600'
                  }
                `}
              >
                <item.icon className="h-6 w-6" />
                <span className="mt-1">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
