'use client'
import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const subjectOptions = [
    'General Inquiry',
    'Technical Support',
    'Billing Question',
    'Feature Request',
    'Bug Report',
    'Partnership',
    'Other'
  ];

  const handleSubjectSelect = (selectedSubject: string) => {
    setSubject(selectedSubject);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* Subject Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subject
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center justify-between"
              >
                <span className={subject ? 'text-gray-900' : 'text-gray-500'}>
                  {subject || 'Select Subject'}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isDropdownOpen ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {subjectOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSubjectSelect(option)}
                      className="w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Message
            </label>
            <textarea
              rows={6}
              placeholder="Write a text..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white placeholder-gray-400 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 group"
            >
              Submit Info
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;