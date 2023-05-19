import React, { useState } from 'react';
import './styles/app.scss';
import { AiOutlineCloudUpload } from 'react-icons/ai'

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0])
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', message);

    try {
      const response = await fetch('http://localhost:3001/send', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Messages sent successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error('Error sending messages:', error);
      setError('An error occurred while sending messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='App'>
      <h1>WhatsApp Bulk Messaging</h1>
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        
        <AiOutlineCloudUpload size={'10vmax'} />
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        
        <br />
      
        <textarea value={message} onChange={handleMessageChange} placeholder='Write message' />
       
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Messages'}
        </button>
      </form>
    </div>
  );
}

export default App;
