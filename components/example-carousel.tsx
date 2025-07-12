"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const examples = [
  {
    idea: "Write a cold outreach email to promote a new AI-powered productivity tool",
    category: "Marketing",
    tag: "Marketing",
  },
  {
    idea: "Generate a LinkedIn post sharing tips for staying productive while working remotely",
    category: "Social Media",
    tag: "Social Media",
  },
  {
    idea: "Write a resume summary for a digital marketing specialist with 3 years of experience",
    category: "Resume & Career",
    tag: "Resume & Career",
  },
  {
    idea: "Create a blog post explaining the benefits of switching to plant-based diets",
    category: "Blog",
    tag: "Blog",
  },
  {
    idea: "Write a character backstory for a detective in a futuristic cyberpunk city",
    category: "Storytelling & Character Building",
    tag: "Storytelling & Character Building",
  },
  {
    idea: "Generate a privacy policy for a mobile app that tracks fitness progress",
    category: "Legal & Policies",
    tag: "Legal & Policies",
  },
  {
    idea: "Write a professional customer support reply apologizing for a missed delivery",
    category: "Customer Support",
    tag: "Customer Support",
  },
  {
    idea: "Create an engaging Instagram caption promoting a summer clothing sale",
    category: "Social Media",
    tag: "Social Media",
  },
  {
    idea: "Write a 500-word article on how AI is transforming the education sector",
    category: "Education",
    tag: "Education",
  },
  {
    idea: "Generate a product description for a wireless noise-canceling headphone",
    category: "Product",
    tag: "Product",
  },
]

interface ExampleCarouselProps {
  onSelectExample?: (idea: string, category: string) => void
}

export function ExampleCarousel({ onSelectExample }: ExampleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length)
    }, 4000) // Change example every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const nextExample = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length)
  }

  const prevExample = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length)
  }

  const handleSelectExample = (example: (typeof examples)[0]) => {
    onSelectExample?.(example.idea, example.category)
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2">
        <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-medium rounded-full">
          {examples[currentIndex].tag}
        </span>
      </div>

      <div className="flex items-center justify-between mt-6 sm:mt-8">
        <button
          onClick={prevExample}
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
          aria-label="Previous example"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex-1 text-center px-2 sm:px-4 py-2 sm:py-4">
          <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-lg mb-4 sm:mb-6 leading-relaxed">
            {examples[currentIndex].idea}
          </p>
          <button
            onClick={() => handleSelectExample(examples[currentIndex])}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg text-sm sm:text-base font-medium"
          >
            Use This Example
          </button>
        </div>

        <button
          onClick={nextExample}
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
          aria-label="Next example"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
