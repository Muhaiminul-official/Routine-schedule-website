import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-red-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold text-lg">University Portal</span>
            </div>
            <p className="text-red-100 text-sm">
              Your comprehensive academic routine and exam schedule management system.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm text-red-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Academic Calendar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Course Catalog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Faculty Directory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Student Portal
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <ul className="space-y-2 text-sm text-red-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-2 text-sm text-red-100">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@university.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 University Ave, City, State</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-red-800 mt-8 pt-8 text-center text-sm text-red-200">
          <p>&copy; 2024 University Portal. All rights reserved. | Developed with ❤️ for students</p>
        </div>
      </div>
    </footer>
  )
}
