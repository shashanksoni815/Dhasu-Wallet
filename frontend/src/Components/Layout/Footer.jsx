// import React from 'react';
// import { Link } from 'react-router-dom';
// import { DollarSign, Github, Twitter, Mail } from 'lucide-react';

// src/components/Layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Live Demo', href: '/demo' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press Kit', href: '/press' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Community', href: '/community' },
        { name: 'API Documentation', href: '/api-docs' },
        { name: 'Status', href: '/status' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Security', href: '/security' },
        { name: 'Cookie Policy', href: '/cookies' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Dhasu Wallet</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Take control of your financial life with smart expense tracking, automated group splitting, and beautiful analytics.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest features and updates delivered to your inbox.</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 flex-1 md:w-64"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Dhasu Wallet. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link to="/security" className="text-gray-400 hover:text-white text-sm transition-colors">
                Security
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Brand */}
//           <div className="col-span-1">
//             <div className="flex items-center space-x-2 mb-4">
//               <DollarSign className="h-8 w-8 text-blue-400" />
//               <span className="text-xl font-bold">ExpenseTracker</span>
//             </div>
//             <p className="text-gray-400 mb-4">
//               Take control of your finances with our powerful expense tracking platform.
//             </p>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <Github className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <Twitter className="h-5 w-5" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <Mail className="h-5 w-5" />
//               </a>
//             </div>
//           </div>

//           {/* Product */}
//           <div>
//             <h3 className="font-semibold mb-4">Product</h3>
//             <ul className="space-y-2">
//               <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
//               <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
//               <li><Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
//               <li><Link to="/demo" className="text-gray-400 hover:text-white transition-colors">Live Demo</Link></li>
//             </ul>
//           </div>

//           {/* Company */}
//           <div>
//             <h3 className="font-semibold mb-4">Company</h3>
//             <ul className="space-y-2">
//               <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
//               <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
//               <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
//               <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="font-semibold mb-4">Support</h3>
//             <ul className="space-y-2">
//               <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
//               <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
//               <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
//               <li><Link to="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//           <p>&copy; 2024 ExpenseTracker. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

