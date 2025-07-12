"use client"

import { useState } from "react"
import {
  X,
  BookOpen,
  Sparkles,
  Play,
  Eye,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Key,
  Brain,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react"

interface DocsModalProps {
  isOpen: boolean
  onClose: () => void
}

const sections = [
  { id: "overview", title: "Overview", icon: BookOpen },
  { id: "getting-started", title: "Getting Started", icon: Sparkles },
  { id: "step-by-step", title: "Step-by-Step Guide", icon: CheckCircle },
  { id: "providers", title: "API Providers", icon: Brain },
  { id: "features", title: "Features", icon: Zap },
  { id: "security", title: "Security", icon: Shield },
]

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  const [activeSection, setActiveSection] = useState("overview")

  if (!isOpen) return null

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is PromptPilot?</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                PromptPilot is a powerful AI prompt generation and execution platform that helps you create, refine, and
                execute high-quality prompts across multiple Large Language Model (LLM) providers.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Whether you're a content creator, marketer, developer, or AI enthusiast, PromptPilot streamlines your
                workflow by generating multiple prompt variations and executing them with real-time cost tracking.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">Key Benefits</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Generate multiple prompt variations instantly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Support for OpenAI, Anthropic, Google, and xAI</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Real-time cost tracking and usage analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Secure API key management with encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Session history and prompt management</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Perfect For</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">Content Creators</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate blog posts, social media content, and marketing copy
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">Developers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create documentation, code comments, and technical content
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">Marketers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Develop campaigns, email sequences, and product descriptions
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">Researchers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate research summaries, analysis, and reports
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About the Developer</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                PromptPilot is developed by <strong>UmeshBingi</strong>, a passionate developer focused on creating
                innovative AI tools that enhance productivity and creativity. This application represents a commitment
                to building secure, user-friendly AI interfaces that respect user privacy while delivering powerful
                functionality.
              </p>
            </div>
          </div>
        )

      case "getting-started":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Getting Started
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                Follow these simple steps to start using PromptPilot and unlock the power of AI-assisted content
                generation.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Choose Your AI Provider
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Select from OpenAI (GPT), Anthropic (Claude), Google (Gemini), or xAI (Grok) based on your needs and
                    budget.
                  </p>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    💡 Tip: Start with OpenAI GPT-4o-mini for cost-effective testing
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Get Your API Key
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Visit your chosen provider's website and create an API key. Each provider has different pricing and
                    capabilities.
                  </p>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    🔒 Your API key is encrypted and stored securely in your browser
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Configure Settings
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Click the Settings button in the header to enter your API key and customize your system prompt
                    template.
                  </p>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    ⚙️ You can change providers and models anytime in settings
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                    Start Creating
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Use the example carousel for inspiration or enter your own idea to generate multiple prompt
                    variations.
                  </p>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    ✨ Generate 1-10 variations to explore different approaches
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
                Quick Start Checklist
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-green-800 dark:text-green-300">
                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="rounded mt-0.5 flex-shrink-0" />
                  <span>Choose an AI provider (OpenAI recommended for beginners)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="rounded mt-0.5 flex-shrink-0" />
                  <span>Create an API key from your provider's website</span>
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="rounded mt-0.5 flex-shrink-0" />
                  <span>Enter API key in PromptPilot Settings</span>
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="rounded mt-0.5 flex-shrink-0" />
                  <span>Try an example from the carousel</span>
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="rounded mt-0.5 flex-shrink-0" />
                  <span>Generate and execute your first prompt</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "step-by-step":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Step-by-Step Usage Guide</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Learn how to use PromptPilot effectively with this detailed walkthrough of the complete workflow.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  1. Prompt Generation
                </h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600" />
                    <div>
                      <strong>Browse Examples:</strong> Use the auto-scrolling carousel to find inspiration or click
                      "Use This Example" to populate the form.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600" />
                    <div>
                      <strong>Enter Your Idea:</strong> Describe what you want to create in the text area. Be specific
                      about your goals and requirements.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600" />
                    <div>
                      <strong>Select Category:</strong> Choose the most relevant category to help the AI understand the
                      context and tone.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600" />
                    <div>
                      <strong>Set Variations:</strong> Choose 1-10 variations to explore different approaches and
                      styles.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-blue-600" />
                    <div>
                      <strong>Generate:</strong> Click "Generate Prompts" and watch as the AI creates multiple optimized
                      prompts for your idea.
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-green-600" />
                  2. Prompt Execution
                </h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-green-600" />
                    <div>
                      <strong>Review Generated Prompts:</strong> Click on any prompt dropdown to expand and review the
                      generated content.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-green-600" />
                    <div>
                      <strong>Execute Individual Prompts:</strong> Click the "Execute" button on any prompt to run it
                      through your selected AI model.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-green-600" />
                    <div>
                      <strong>Execute All at Once:</strong> Use "Execute All" to run all generated prompts
                      simultaneously for comparison.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-green-600" />
                    <div>
                      <strong>Copy Results:</strong> Use the "Copy Result" button to copy any generated content to your
                      clipboard.
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-600" />
                  3. Review and Manage
                </h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-purple-600" />
                    <div>
                      <strong>View Execution Summary:</strong> Monitor costs, response times, and usage statistics in
                      real-time.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-purple-600" />
                    <div>
                      <strong>Access History:</strong> Switch to the History tab to view all your previous sessions and
                      results.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-purple-600" />
                    <div>
                      <strong>Edit System Prompts:</strong> Customize the execution system prompt for different types of
                      content generation.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-purple-600" />
                    <div>
                      <strong>Manage Sessions:</strong> View detailed session information and reuse successful prompts.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-yellow-800 dark:text-yellow-300 text-sm">
                <li>• Start with 3-5 variations to balance quality and cost</li>
                <li>• Use specific, detailed descriptions for better prompt generation</li>
                <li>• Try different categories to see how they affect the output style</li>
                <li>• Monitor your API costs using the execution summary</li>
                <li>• Save successful prompts by copying them before starting new sessions</li>
              </ul>
            </div>
          </div>
        )

      case "providers":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Supported AI Providers
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                PromptPilot supports multiple AI providers, each with unique strengths and pricing models. Choose the
                one that best fits your needs.
              </p>
            </div>

            <div className="grid gap-3 sm:gap-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">OpenAI (GPT)</h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full w-fit">
                    Recommended
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Industry-leading language models with excellent performance across all content types.
                </p>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <strong className="min-w-0 sm:min-w-[80px]">Models:</strong>
                    <span className="break-words">GPT-4o, GPT-4o-mini, GPT-3.5-turbo</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <strong className="min-w-0 sm:min-w-[80px]">Best for:</strong>
                    <span>General content, coding, analysis</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <strong className="min-w-0 sm:min-w-[80px]">API Key format:</strong>
                    <span className="font-mono">sk-...</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <strong className="min-w-0 sm:min-w-[80px]">Get API Key:</strong>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center break-all"
                    >
                      platform.openai.com <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Anthropic (Claude)</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Advanced AI with strong reasoning capabilities and excellent safety features.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Models:</strong> Claude 3.5 Sonnet, Claude 3 Haiku
                  </div>
                  <div>
                    <strong>Best for:</strong> Complex reasoning, analysis, creative writing
                  </div>
                  <div>
                    <strong>API Key format:</strong> sk-ant-...
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong>Get API Key:</strong>
                    <a
                      href="https://console.anthropic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      console.anthropic.com <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Google (Gemini)</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Google's multimodal AI with strong performance and competitive pricing.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Models:</strong> Gemini 1.5 Pro, Gemini 1.5 Flash
                  </div>
                  <div>
                    <strong>Best for:</strong> Fast generation, cost-effective solutions
                  </div>
                  <div>
                    <strong>API Key format:</strong> AI...
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong>Get API Key:</strong>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      aistudio.google.com <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">xAI (Grok)</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Elon Musk's AI with unique personality and real-time information access.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Models:</strong> Grok Beta
                  </div>
                  <div>
                    <strong>Best for:</strong> Creative content, current events, humor
                  </div>
                  <div>
                    <strong>API Key format:</strong> xai-...
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong>Get API Key:</strong>
                    <a
                      href="https://console.x.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      console.x.ai <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Choosing the Right Provider
              </h3>
              <div className="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
                <div>
                  <strong>For beginners:</strong> Start with OpenAI GPT-4o-mini for cost-effective testing
                </div>
                <div>
                  <strong>For quality:</strong> Use GPT-4o or Claude 3.5 Sonnet for best results
                </div>
                <div>
                  <strong>For speed:</strong> Try Gemini 1.5 Flash for rapid generation
                </div>
                <div>
                  <strong>For creativity:</strong> Experiment with Grok for unique perspectives
                </div>
              </div>
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Discover all the powerful features that make PromptPilot the ultimate AI prompt management platform.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  Smart Prompt Generation
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Generate 1-10 unique prompt variations from a single idea</li>
                  <li>• Category-based optimization for different content types</li>
                  <li>• Customizable system prompt templates</li>
                  <li>• Auto-scrolling example carousel for inspiration</li>
                  <li>• Real-time generation progress tracking</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-green-600" />
                  Advanced Execution
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Execute individual prompts or all at once</li>
                  <li>• Dropdown interface for easy prompt management</li>
                  <li>• Real-time cost tracking per execution</li>
                  <li>• Response time monitoring</li>
                  <li>• One-click result copying</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Multi-Provider Support
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• OpenAI GPT models (GPT-4o, GPT-4o-mini, GPT-3.5-turbo)</li>
                  <li>• Anthropic Claude models (Sonnet, Haiku)</li>
                  <li>• Google Gemini models (1.5 Pro, 1.5 Flash)</li>
                  <li>• xAI Grok Beta</li>
                  <li>• Easy provider switching without data loss</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Security & Privacy
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Client-side API key encryption</li>
                  <li>• 24-hour automatic key expiration</li>
                  <li>• No data sent to external servers</li>
                  <li>• Rate limiting protection</li>
                  <li>• Secure local storage management</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  Session Management
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Complete session history tracking</li>
                  <li>• Detailed execution summaries</li>
                  <li>• Cost analysis and usage statistics</li>
                  <li>• Session replay and review</li>
                  <li>• Export and sharing capabilities</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  User Experience
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Dark/light mode support</li>
                  <li>• Responsive design for all devices</li>
                  <li>• Real-time network status monitoring</li>
                  <li>• Intuitive dropdown interfaces</li>
                  <li>• Comprehensive error handling</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Security & Privacy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                PromptPilot takes your security and privacy seriously. Learn about our comprehensive security measures
                and best practices.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Guarantees
              </h3>
              <ul className="space-y-2 text-green-800 dark:text-green-300 text-sm">
                <li>✅ Your API keys never leave your browser</li>
                <li>✅ All data is encrypted before storage</li>
                <li>✅ No tracking or analytics collection</li>
                <li>✅ Open-source security practices</li>
                <li>✅ Automatic data expiration</li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Key className="w-5 h-5 mr-2 text-blue-600" />
                  API Key Protection
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  <div>
                    <strong>Client-Side Encryption:</strong> API keys are encrypted using advanced XOR encryption with
                    initialization vectors before being stored locally.
                  </div>
                  <div>
                    <strong>Automatic Expiration:</strong> All stored API keys automatically expire after 24 hours for
                    maximum security.
                  </div>
                  <div>
                    <strong>Secure Input:</strong> API key inputs use secure attributes to prevent browser password
                    managers and extensions from accessing them.
                  </div>
                  <div>
                    <strong>Masked Display:</strong> API keys are always masked in the interface, showing only the first
                    and last 4 characters.
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Data Handling
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  <div>
                    <strong>Local Storage Only:</strong> All your data (prompts, history, settings) is stored locally in
                    your browser.
                  </div>
                  <div>
                    <strong>No Server Storage:</strong> PromptPilot doesn't store any of your data on external servers.
                  </div>
                  <div>
                    <strong>Input Sanitization:</strong> All user inputs are sanitized to prevent injection attacks.
                  </div>
                  <div>
                    <strong>Rate Limiting:</strong> Built-in rate limiting protects against abuse and excessive API
                    usage.
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  API Usage Protection
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  <div>
                    <strong>Cost Monitoring:</strong> Real-time cost tracking helps you monitor API usage and spending.
                  </div>
                  <div>
                    <strong>Request Limits:</strong> Built-in limits prevent accidental excessive API calls.
                  </div>
                  <div>
                    <strong>Timeout Protection:</strong> All API requests have timeouts to prevent hanging requests.
                  </div>
                  <div>
                    <strong>Error Handling:</strong> Comprehensive error handling protects against API failures.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                Security Best Practices
              </h3>
              <ul className="space-y-2 text-yellow-800 dark:text-yellow-300 text-sm">
                <li>• Regularly rotate your API keys with your providers</li>
                <li>• Monitor your API usage and costs regularly</li>
                <li>• Use the "Clear All Data" feature when using shared computers</li>
                <li>• Keep your browser updated for the latest security features</li>
                <li>• Never share your API keys with others</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">What We Don't Do</h3>
              <ul className="space-y-2 text-red-800 dark:text-red-300 text-sm">
                <li>❌ We don't store your API keys on our servers</li>
                <li>❌ We don't track your usage or collect analytics</li>
                <li>❌ We don't share your data with third parties</li>
                <li>❌ We don't require account creation or personal information</li>
                <li>❌ We don't have access to your generated content</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-gray-50 dark:bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:block">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Documentation</h2>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="grid grid-cols-2 lg:grid-cols-1 gap-1 sm:gap-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-2 lg:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-left transition-colors text-xs sm:text-sm ${
                    activeSection === section.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium truncate">{section.title}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {sections.find((s) => s.id === activeSection)?.title}
            </h1>
            <button
              onClick={onClose}
              className="hidden lg:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
