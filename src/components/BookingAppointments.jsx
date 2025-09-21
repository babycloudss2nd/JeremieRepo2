import { useState } from 'react';
import './BookingAppointments.css';

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const VideoIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="23,7 16,12 23,17"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

export default function BookingAppointments({ appointments = [], setAppointments, cart = [] }) {
  const [meetingType, setMeetingType] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [onlinePlatform, setOnlinePlatform] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleMeetingTypeSelect = (type) => {
    setMeetingType(type);
    setShowCalendar(true);
    setIsBooked(false);
  };

  const handleBooking = () => {
    if (
      selectedDate &&
      selectedTime &&
      ((meetingType === 'in-person' && address) ||
        (meetingType === 'online' && onlinePlatform))
    ) {
      const newAppointment = {
        id: Date.now(),
        type: meetingType === 'online' ? 'Online Meeting' : 'In-Person Meeting',
        date: selectedDate,
        time: selectedTime,
        location: meetingType === 'in-person' ? address : onlinePlatform,
      };

      setAppointments((prev) => [...prev, newAppointment]);
      setIsBooked(true);
    }
  };

  const resetBooking = () => {
    setMeetingType('');
    setShowCalendar(false);
    setSelectedDate('');
    setSelectedTime('');
    setAddress('');
    setOnlinePlatform('');
    setIsBooked(false);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="booking-container">
      {isBooked ? (
        <div className="confirmation-card">
          <div className="confirmation-header">
            <CheckIcon className="success-icon" />
            <h2 className="confirmation-title">Booking Confirmed!</h2>
            <p className="confirmation-subtitle">
              Your appointment has been successfully scheduled.
            </p>
          </div>

          <div className="booking-details">
            <h3 className="details-title">Appointment Details:</h3>
            <p className="detail-item">
              <strong>Type:</strong>{' '}
              {meetingType === 'online' ? 'Online Meeting' : 'In-Person Meeting'}
            </p>
            <p className="detail-item">
              <strong>Date:</strong>{' '}
              {new Date(selectedDate).toLocaleDateString()}
            </p>
            <p className="detail-item">
              <strong>Time:</strong> {selectedTime}
            </p>
            {meetingType === 'in-person' ? (
              <p className="detail-item">
                <strong>Address:</strong> {address}
              </p>
            ) : (
              <p className="detail-item">
                <strong>Platform:</strong> {onlinePlatform}
              </p>
            )}
          </div>

          <button onClick={resetBooking} className="btn-primary full-width">
            Book Another Appointment
          </button>
        </div>
      ) : (
        <div className="booking-content">
          <div className="header-section">
            <h1 className="main-title">Book an Appointment</h1>
            <p className="main-subtitle">
              Choose your preferred meeting type and schedule a time that works
              for you
            </p>
          </div>

          {!showCalendar ? (
            <div className="meeting-options">
              <div
                onClick={() => handleMeetingTypeSelect('online')}
                className="meeting-card online-card"
              >
                <div className="card-content">
                  <div className="icon-wrapper online-icon">
                    <VideoIcon className="card-icon" />
                  </div>
                  <h3 className="card-title">Online Meeting</h3>
                  <p className="card-description">
                    Connect virtually through video call
                  </p>
                  <div className="card-features">
                    <span className="feature-item">
                      <ClockIcon className="feature-icon" />
                      Flexible timing
                    </span>
                    <span className="feature-item">
                      <UsersIcon className="feature-icon" />
                      Remote access
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleMeetingTypeSelect('in-person')}
                className="meeting-card inperson-card"
              >
                <div className="card-content">
                  <div className="icon-wrapper inperson-icon">
                    <MapPinIcon className="card-icon" />
                  </div>
                  <h3 className="card-title">In-Person Meeting</h3>
                  <p className="card-description">
                    Meet face-to-face at a physical location
                  </p>
                  <div className="card-features">
                    <span className="feature-item">
                      <ClockIcon className="feature-icon" />
                      Scheduled timing
                    </span>
                    <span className="feature-item">
                      <MapPinIcon className="feature-icon" />
                      Physical location
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="calendar-section">
              <div className="calendar-header">
                <h2 className="calendar-title">
                  Schedule your {meetingType === 'online' ? 'Online' : 'In-Person'} Meeting
                </h2>
                <button onClick={resetBooking} className="back-button">
                  ← Back to options
                </button>
              </div>

              <div className="calendar-content">
                <div className="date-time-section">
                  <h3 className="section-title">
                    <CalendarIcon className="section-icon" />
                    Select Date
                  </h3>
                  <div className="calendar-grid">
                    <div className="calendar-header-row">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="calendar-day-header">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="calendar-dates">
                      {generateCalendarDates().slice(0, 21).map((date) => {
                        const dateObj = new Date(date);
                        const isSelected = selectedDate === date;
                        return (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`calendar-date ${isSelected ? 'selected' : ''}`}
                          >
                            {dateObj.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <h3 className="section-title time-title">
                    <ClockIcon className="section-icon" />
                    Select Time
                  </h3>
                  <div className="time-slots">
                    {generateTimeSlots().map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="details-section">
                  {meetingType === 'in-person' ? (
                    <div>
                      <h3 className="section-title">
                        <MapPinIcon className="section-icon" />
                        Meeting Address
                      </h3>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter the address where you'd like to meet..."
                        className="address-input"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="section-title">
                        <VideoIcon className="section-icon" />
                        Choose Platform
                      </h3>
                      <div className="platform-options">
                        <button
                          onClick={() => setOnlinePlatform('Google Meet')}
                          className={`platform-button ${onlinePlatform === 'Google Meet' ? 'selected' : ''}`}
                        >
                          Google Meet
                        </button>
                        <button
                          onClick={() => setOnlinePlatform('Zoom Call')}
                          className={`platform-button ${onlinePlatform === 'Zoom Call' ? 'selected' : ''}`}
                        >
                          Zoom Call
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedDate && selectedTime && (
                    <div className="booking-summary">
                      <h4 className="summary-title">Booking Summary</h4>
                      <p>
                        <strong>Type:</strong> {meetingType === 'online' ? 'Online Meeting' : 'In-Person Meeting'}
                      </p>
                      <p>
                        <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTime}
                      </p>
                      {meetingType === 'in-person' && address && (
                        <p>
                          <strong>Address:</strong> {address}
                        </p>
                      )}
                      {meetingType === 'online' && onlinePlatform && (
                        <p>
                          <strong>Platform:</strong> {onlinePlatform}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleBooking}
                    disabled={
                      !selectedDate ||
                      !selectedTime ||
                      (meetingType === 'in-person' && !address) ||
                      (meetingType === 'online' && !onlinePlatform)
                    }
                    className="btn-primary full-width book-button"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
