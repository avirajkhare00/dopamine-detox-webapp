"use client";

import { useState, FormEvent } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    duration: "24 hours",
    allowedActivities: "",
    forbiddenActivities: "",
    goals: "",
    includeSchedule: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Call our API to generate the markdown content using OpenAI
      const aiResponse = await axios.post('/api/generate-plan', formData);
      const markdown = aiResponse.data.markdown;
      
      // Send markdown to API for PDF conversion
      const response = await axios.post('https://md-to-pdf.up.railway.app/convert/pdf', markdown, {
        headers: {
          'Content-Type': 'text/markdown'
        },
        responseType: 'blob'
      });
      
      // Create a URL for the PDF blob
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // We're now using the OpenAI API to generate the markdown content

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Dopamine Detox Planner</h1>
          <p className="text-gray-600 dark:text-gray-300">Create your personalized detox plan and download it as a PDF</p>
        </header>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">What is a Dopamine Detox?</h2>
          <p className="mb-4 dark:text-gray-200">
            A dopamine detox is a period where you intentionally reduce activities that cause dopamine spikes 
            (like social media, video games, or processed foods) to help reset your brain's reward system.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Disclaimer:</strong> This is a self-experiment and not a substitute for professional medical advice.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {!pdfUrl ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Detox Duration
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="24 hours">24 hours</option>
                  <option value="48 hours">48 hours</option>
                  <option value="3 days">3 days</option>
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="allowedActivities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Allowed Activities
                </label>
                <textarea
                  id="allowedActivities"
                  name="allowedActivities"
                  value={formData.allowedActivities}
                  onChange={handleChange}
                  placeholder="e.g., reading, walking, meditation, spending time in nature"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate activities with commas</p>
              </div>
              
              <div>
                <label htmlFor="forbiddenActivities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Activities to Avoid
                </label>
                <textarea
                  id="forbiddenActivities"
                  name="forbiddenActivities"
                  value={formData.forbiddenActivities}
                  onChange={handleChange}
                  placeholder="e.g., social media, video games, watching TV, processed foods"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate activities with commas</p>
              </div>
              
              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Goals (Optional)
                </label>
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  placeholder="e.g., improve focus, reduce screen time, increase mindfulness"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="includeSchedule"
                  name="includeSchedule"
                  type="checkbox"
                  checked={formData.includeSchedule}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="includeSchedule" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Include a basic time-blocked schedule
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {isLoading ? 'Generating Plan...' : 'Generate Detox Plan'}
                </button>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-400">Your plan is ready!</h3>
                <p className="text-green-600 dark:text-green-300 mt-1">Click the button below to download your personalized detox plan.</p>
              </div>
              
              <div>
                <a
                  href={pdfUrl}
                  download="dopamine-detox-plan.pdf"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Download PDF
                </a>
              </div>
              
              <button
                onClick={() => {
                  setPdfUrl(null);
                  setFormData({
                    duration: "24 hours",
                    allowedActivities: "",
                    forbiddenActivities: "",
                    goals: "",
                    includeSchedule: false,
                  });
                }}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Create another plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
