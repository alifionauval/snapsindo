import React, { useState } from 'react';
import '../styles/KontakKami.css';
import axios from 'axios';

const KontakKami = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationType, setReservationType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    date: '',
    message: '',
    no_telepon: '',
    jenis_paket: ''
  });

  // Daftar paket yang tersedia
  const paketOptions = ['Small', 'Medium','Big'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOrderClick = (type) => {
    // Konversi tipe paket ke format yang sesuai dengan backend
    const packageType = type.split(' ')[0]; // Mengambil kata pertama saja ("Small", "Medium", "Big")
    
    setReservationType(type);
    setFormData(prevState => ({
      ...prevState,
      jenis_paket: packageType // Simpan hanya "Small", "Medium", atau "Big"
    }));
    setShowPopup(true);
  };
  

  const constructWhatsAppMessage = (formData) => {
    const message = `Halo, saya ${formData.name} tertarik untuk memesan event ${formData.jenis_paket} melalui Snapsindo!
    
Detail pesanan:
- Subject: ${formData.subject}
- Tanggal: ${formData.date}
- Pesan: ${formData.message}

Mohon dapat dihubungi kembali melalui:
- Email: ${formData.email}
- No. Telepon: ${formData.no_telepon}`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async () => {
    try {
      // Validasi form
      if (!formData.name || !formData.email || !formData.no_telepon || !formData.jenis_paket) {
        alert('Harap isi semua field yang wajib');
        return;
      }
  
      // Format data sesuai kebutuhan backend
      const orderData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || '', // Pastikan tidak null
        date: formData.date || '', // Pastikan tidak null
        message: formData.message || '', // Pastikan tidak null
        no_telepon: formData.no_telepon,
        jenis_paket: formData.jenis_paket.split(' ')[0] // Ambil kata pertama saja
      };
  
      // Kirim data ke backend
      const response = await axios.post('https://backend-dsnap.vercel.app/api/order', orderData);
      
      if (response.status === 200 || response.status === 201) {
        // Buat pesan WhatsApp
        const whatsappMessage = constructWhatsAppMessage(formData);
        
        // Redirect ke WhatsApp
        window.open(
          'https://wa.me/628128218017?text=${whatsappMessage}',
          '_blank'
        );
        
        // Tutup popup dan reset form
        setShowPopup(false);
        setShowConfirmation(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          date: '',
          message: '',
          no_telepon: '',
          jenis_paket: ''
        });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Gagal mengirim pesanan. Silakan coba lagi.');
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleConfirmYes = () => {
    handleSubmit();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Reset form data
    setFormData({
      name: '',
      email: '',
      subject: '',
      date: '',
      message: '',
      no_telepon: '',
      jenis_paket: ''
    });
  };

  return (
    <div>
      {/* Header image for Our Services */}
      <section className="header-our-services">
        <img src={require('../assets/header-our-services.png')} alt="Our Services Header" />
        <h2 className="header-text">Enjoy Our Services !</h2>
      </section>

      {/* Event Packages Grid Section */}
      <section className="event-packages">
        <div className="event-grid">
          {/* Small Event */}
          <div className="event-card">
            <img src={require('../assets/small-event.png')} alt="Small Event" />
            <h4>Small Event</h4>
            <p>Benefits</p>
            <ul>
              <li>Crew</li>
              <li>Small Booth</li>
              <li>Tools</li>
            </ul>
            <div className="event-footer">
              <p className="price">Start From IDR 10.000.000,00</p>
              <button className="order-button" onClick={() => handleOrderClick('Small')}>Order Now</button>
            </div>
          </div>

          {/* Medium Event */}
          <div className="event-card">
            <img src={require('../assets/medium-event.jpg')} alt="Medium Event" />
            <h4>Medium Event</h4>
            <p>Benefits</p>
            <ul>
              <li>Crew</li>
              <li>Medium Booth</li>
              <li>Tools</li>
              <li>MC</li>
            </ul>
            <div className="event-footer">
              <p className="price">Start From IDR 25.000.000,00</p>
              <button className="order-button" onClick={() => handleOrderClick('Medium')}>Order Now</button>
            </div>
          </div>

          {/* Big Event */}
          <div className="event-card">
            <img src={require('../assets/big-event.jpg')} alt="Big Event" />
            <h4>Big Event</h4>
            <p>Benefits</p>
            <ul>
              <li>Crew</li>
              <li>Large Booth</li>
              <li>Tools</li>
              <li>MC</li>
              <li>Sales</li>
              <li>KOL</li>
            </ul>
            <div className="event-footer">
              <p className="price">Start From IDR 50.000.000,00</p>
              <button className="order-button" onClick={() => handleOrderClick('Big')}>Order Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Konfirmasi Popup */}
      {showConfirmation && (
        <div className="confirmation-overlay" onClick={handleCloseConfirmation}>
          <div className="confirmation-box" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to reserve the {reservationType} Event?</p>
            <div className="confirmation-buttons">
              <button className="confirm-yes" onClick={handleConfirmYes}>Yes</button>
              <button className="confirm-no" onClick={handleCloseConfirmation}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up untuk Order */}
      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-form" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleClosePopup}>
              &#10006;
            </button>
            <form>
              <label htmlFor="name">Name or Company Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Enter name or company"
                value={formData.name}
                onChange={handleInputChange}
                required 
              />

              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                required 
              />

              <label htmlFor="jenis_paket">Jenis Paket *</label>
              <select 
                id="jenis_paket" 
                name="jenis_paket"
                value={formData.jenis_paket}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Jenis Paket</option>
                {paketOptions.map((paket) => (
                  <option key={paket} value={paket}>
                    {paket}
                  </option>
                ))}
              </select>

              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleInputChange} 
              />

              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange} 
              />

              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>

              <label htmlFor="no_telepon">Phone Number *</label>
              <input 
                type="tel" 
                id="no_telepon" 
                name="no_telepon" 
                placeholder="Enter phone number"
                value={formData.no_telepon}
                onChange={handleInputChange}
                required 
              />

              <button 
                type="button" 
                className="submit-button" 
                onClick={handleSubmit}
              >
                Order Now !
              </button>
            </form>
          </div>
        </div>
      )}

      {/* White background section for contact options */}
      <section className="kontak-buttons">
        <h3>Contact Us Here !</h3>
        <div className="button-group">
          <a href="https://wa.me/628128218017" target="_blank" rel="noopener noreferrer" className="button whatsapp">
            <img src={require('../assets/whatsapp2.png')} alt="WhatsApp icon" />
            <span>Click Here !</span>
          </a>
          <a href="mailto:agus@snapsindonesia.co.id" className="button email">
            <img src={require('../assets/mail2.png')} alt="Email icon" />
            <span>Click Here !</span>
          </a>
          <a href="https://www.instagram.com/dsnap_id" target="_blank" rel="noopener noreferrer" className="button instagram">
            <img src={require('../assets/instagram2.png')} alt="Instagram icon" />
            <span>Click Here !</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default KontakKami;