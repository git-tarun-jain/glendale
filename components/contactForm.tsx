import { useState } from 'react';



export default function ContactFormWithFile() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');

    const form = e.currentTarget;
    const formData = new FormData(form);
const CF7_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? '';
    try {
      const res = await fetch(CF7_URL + 'wp-json/contact-form-7/v1/contact-forms/1553/feedback', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.status === 'mail_sent') {
        setStatus('✅ Message sent successfully!');
        form.reset();
      } else {
        setStatus(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('❌ Submission failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="your-name" placeholder="Your Name" required />
      <input type="email" name="your-email" placeholder="Your Email" required />
      <textarea name="your-message" placeholder="Message" required></textarea>
      <input type="file" name="your-file" accept=".pdf,.jpg,.png" required />
      <button type="submit">Send</button>
      <p>{status}</p>
    </form>
  );
}
