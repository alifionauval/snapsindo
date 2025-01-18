import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/Chatbot.css';
import smileLogo from '../assets/Smilelogo.png';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [language, setLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEventSelection, setIsEventSelection] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleLanguageChoice = (lang) => {
    setLanguage(lang);
    setMessages([
      {
        text: lang === 'indonesia'
          ? 'Selamat datang di Chatbot, ada yang ingin ditanyakan? <br /> Kami menyediakan pertanyaan seputar: <br /> • Tentang Perusahaan <br /> • Kelebihan Perusahaan <br /> • Layanan Event Apa Saja Yang Disediakan <br /> • Benefit Yang Didapat <br />  • Berapa Biaya Untuk Layanan Event yang Tersedia <br /> • Apakah Layanan Ini Bisa di Seluruh Indonesia'
          : 'Welcome to the Chatbot, is there anything you would like to ask? <br /> We provide questions regarding: <br /> • About the Company <br /> • Company Advantages  <br /> • Available Event Services  <br /> • Company Benefits  <br />  • How Much Do the Available Event Services Cost <br /> • Is This Service Available Across Indonesia',
        type: 'bot',
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !language) return;

    const userMessage = {
      text: inputMessage,
      type: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (isEventSelection) {
        const eventRequest = {
          eventName: inputMessage,
          language,
        };

        const response = await axios.post('https://backend-dsnap.vercel.app/api/chatbot', eventRequest);

        const botMessage = {
          text: response.data.response,
          type: 'bot',
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsEventSelection(false);
      } else {
        const chatRequest = {
          message: inputMessage,
          language,
        };

        const response = await axios.post('https://backend-dsnap.vercel.app/api/chatbot', chatRequest);

        if (response.data.response === 'Silakan pilih acara terlebih dahulu.' ||
          response.data.response === 'Please select an event to know its cost.') {
          const botMessage = {
            text: `${response.data.response} For example: Community Celebration, Product Launch, Corporate Conference, Musical Event, Sport Event, etc.`,
            type: 'bot',
          };

          setMessages((prev) => [...prev, botMessage]);
          setIsEventSelection(true);
        } else {
          const botMessage = {
            text: response.data.response,
            type: 'bot',
          };

          setMessages((prev) => [...prev, botMessage]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
        type: 'bot',
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const renderContent = () => {
    if (!language) {
      return (
        <div className="language-selection">
          <p>Pilih bahasa / Choose language:</p>
          <div className="button-container">
            <button onClick={() => handleLanguageChoice('indonesia')}>Indonesia</button>
            <button onClick={() => handleLanguageChoice('english')}>English</button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.type}`}
              dangerouslySetInnerHTML={{ __html: message.text }}
            ></div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isEventSelection ? 'Masukkan nama acara...' : 'Ketik pesan Anda...'}
            disabled={isLoading}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="send-btn"
          >
            Kirim
          </button>
        </form>
      </>
    );
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>d'snap! Chatbot</h3>
            <button className="close-btn" onClick={toggleChat}>
              &times;
            </button>
          </div>
          {renderContent()}
        </div>
      )}
      <img
        src={smileLogo}
        alt="Smile Logo"
        className="chatbot-logo"
        onClick={toggleChat}
      />
    </div>
  );
};

export default Chatbot;
