"use client"

import { Heart, ExternalLink } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <span className="text-sm">©{currentYear} Copyright @UmeshBingi. All rights reserved.</span>
          </div>

          {/* Made with love */}
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <span className="text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-sm">for AI enthusiasts</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4 text-sm">
           {/*
           <a
              href="https://github.com/BingiUmesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="www.linkedin.com/in/umesh-bingi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1"
            >
              <span>Linkedin</span>
              <ExternalLink className="w-3 h-3" />
            </a>*/}
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
