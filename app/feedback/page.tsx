'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Footer from '../footer/page';

export default function FeedbackForm() {
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    feedback: ''
  });

  useEffect(() => {
    emailjs.init('Kra_Xcv86bnZDwvMb');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_xppqg5k',
        'template_10d2u7a',
        {
          from_email: formData.email,
          message: formData.feedback,
          to_email: 'your-email@example.com'
        }
      );
      
      setStatus('Thank you for your feedback!');
      setFormData({ email: '', feedback: '' });
    } catch (error) {
      setStatus('Failed to submit feedback');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isValid = formData.email.trim() !== '' && 
                 formData.feedback.trim() !== '' && 
                 !isSubmitting;

  return (
    <div className="min-h-screen flex flex-col items-center bg-amber-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <section className="w-full max-w-lg text-center mt-8">
          <h1 className="text-xl font-semibold">About</h1>
          <p className="mt-4 text-gray-700">
            We are here together. We all want to make our lives worth living. 
            We are at your service to support you and help you.
            Sometimes, we just need deep discussions to analyze what we need 
            to fix in our lives. We hope we can help you.
          </p>
        </section>

        <h2 className="text-xl font-semibold text-center">Feedback</h2>
        <p className="mt-2">
          To give you the best possible support, please provide feedback on your experience.
        </p>

        <textarea
          name="feedback"
          required
          value={formData.feedback}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Write your feedback here"
        />

        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Your email address"
        />

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full px-6 py-2 rounded-md ${
            isValid 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {status && (
          <p className={`text-center ${
            status.includes('Failed') ? 'text-red-500' : 'text-green-500'
          }`}>
            {status}
          </p>
        )}
      </form>
      <Footer />
    </div>
  );
}