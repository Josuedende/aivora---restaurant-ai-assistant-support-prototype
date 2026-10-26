import React, { useState, useMemo } from 'react';
import { RestaurantProfile, CustomerConversation, BookingReservation } from '../../types';

interface BookingsViewProps {
  restaurant: RestaurantProfile;
  conversations?: CustomerConversation[];
  onSelectConversation?: (id: string) => void;
}

// Client date request from inquiry
interface ClientInquiryRequest {
  id: string;
  clientName: string;
  phone: string;
  requestedDate: string; // YYYY-MM-DD
  preferredTime: string;
  requestedGuests: number;
  channel: 'WhatsApp' | 'Web Widget' | 'Phone';
  notes?: string;
}

// Exactly one client request as specified
const singleClientRequest: ClientInquiryRequest = {
  id: 'inq-1',
  clientName: 'Sarah Jenkins',
  phone: '+27 82 459 2811',
  requestedDate: '2026-09-24',
  preferredTime: '19:30',
  requestedGuests: 4,
  channel: 'WhatsApp',
  notes: 'Anniversary dinner. Quiet table requested.',
};

const TOTAL_VENUE_CAPACITY = 50; // Total guest seats in restaurant

export const BookingsView: React.FC<BookingsViewProps> = ({
  restaurant,
}) => {
  // Confirmed bookings list
  const [bookings, setBookings] = useState<BookingReservation[]>([]);

  // Single client request
  const [clientRequest, setClientRequest] = useState<ClientInquiryRequest | null>(singleClientRequest);

  // The client-provided date (the calendar displays info based on this requested date)
  const [clientProvidedDate, setClientProvidedDate] = useState<string | null>('2026-09-24');

  // Input state for entering a client provided date
  const [inputDate, setInputDate] = useState<string>('2026-09-24');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calendar month state
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed: 8)

  // Check if client request is currently confirmed
  const isClientRequestConfirmed = useMemo(() => {
    if (!clientRequest) return false;
    return bookings.some(
      (b) => b.guestName === clientRequest.clientName && b.date === clientRequest.requestedDate && b.status !== 'Cancelled'
    );
  }, [bookings, clientRequest]);

  // Calculate seat occupancy specifically for a date
  const getOccupancyForDate = (dateStr: string) => {
    const dayBookings = bookings.filter((b) => b.date === dateStr && b.status !== 'Cancelled');
    const bookedSeats = dayBookings.reduce((sum, b) => sum + b.guests, 0);
    return {
      dateStr,
      dayBookings,
      bookedSeats,
      totalCapacity: TOTAL_VENUE_CAPACITY,
      remainingSeats: Math.max(0, TOTAL_VENUE_CAPACITY - bookedSeats),
    };
  };

  // Occupancy for the currently client-provided date
  const clientDateOccupancy = useMemo(() => {
    if (!clientProvidedDate) return null;
    return getOccupancyForDate(clientProvidedDate);
  }, [bookings, clientProvidedDate]);

  // Calendar days calculation
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const startOffset = (firstDayIndex + 6) % 7; // Monday as 0

    const days: { dayNumber: number; dateStr: string }[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(i).padStart(2, '0');
      days.push({
        dayNumber: i,
        dateStr: `${currentYear}-${monthStr}-${dayStr}`,
      });
    }

    return { days, startOffset };
  }, [currentYear, currentMonth]);

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // Set selected date
  const handleSetClientDate = (dateToSet: string) => {
    setClientProvidedDate(dateToSet);
    setInputDate(dateToSet);
  };

  // Confirm booking for client request
  const handleConfirmBooking = () => {
    if (!clientRequest) return;

    if (isClientRequestConfirmed) {
      setToastMessage(`Booking for ${clientRequest.clientName} is already confirmed.`);
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    const newBooking: BookingReservation = {
      id: `booking-${Date.now()}`,
      guestName: clientRequest.clientName,
      phone: clientRequest.phone,
      date: clientRequest.requestedDate,
      time: clientRequest.preferredTime,
      guests: clientRequest.requestedGuests,
      seatingArea: 'Garden Courtyard',
      notes: clientRequest.notes,
      status: 'Confirmed',
      channel: clientRequest.channel,
      createdAt: 'Just now',
    };

    setBookings((prev) => [newBooking, ...prev]);
    setClientProvidedDate(clientRequest.requestedDate);
    setInputDate(clientRequest.requestedDate);

    setToastMessage(`Booking confirmed for ${clientRequest.clientName} (${clientRequest.requestedGuests} seats) on ${clientRequest.requestedDate}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancelBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setToastMessage('Booking removed. Seats updated.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Bookings & Calendar
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review reservation requests and table availability.
        </p>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-slate-100 border border-slate-300 text-slate-900 text-xs rounded-xl flex items-center justify-between shadow-2xs animate-fadeIn">
          <span className="font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-600 hover:text-slate-950 font-bold px-2 py-0.5 text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Booking Request Card */}
      {clientRequest && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{clientRequest.clientName}</span>
              <span className="text-[10px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                {clientRequest.channel}
              </span>
              {isClientRequestConfirmed ? (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  ✓ Confirmed
                </span>
              ) : (
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                  New Request
                </span>
              )}
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2 font-mono">
              <span className="font-semibold text-slate-900">{clientRequest.requestedDate}</span>
              <span>·</span>
              <span>{clientRequest.preferredTime}</span>
              <span>·</span>
              <span>{clientRequest.requestedGuests} guests</span>
            </div>
            {clientRequest.notes && (
              <p className="text-[11px] text-slate-500 italic">
                "{clientRequest.notes}"
              </p>
            )}
          </div>

          <div className="shrink-0">
            {isClientRequestConfirmed ? (
              <span className="inline-flex items-center px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                ✓ Booking Confirmed
              </span>
            ) : (
              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      )}

      {/* Two-Column Layout: Calendar (Left) & Date Overview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: CALENDAR (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-900 tracking-tight">
                {monthName}
              </h2>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer font-bold text-sm"
                  title="Previous month"
                >
                  ‹
                </button>
                <button
                  onClick={() => {
                    setCurrentMonth(8);
                    setCurrentYear(2026);
                    handleSetClientDate('2026-09-24');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer font-bold text-sm"
                  title="Next month"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: calendarDays.startOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-xl bg-slate-50/40 border border-transparent" />
              ))}

              {calendarDays.days.map(({ dayNumber, dateStr }) => {
                const dayOcc = getOccupancyForDate(dateStr);
                const isSelected = clientProvidedDate === dateStr;
                const isToday = dateStr === '2026-09-24';
                const hasBookings = dayOcc.bookedSeats > 0;

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleSetClientDate(dateStr)}
                    className={`h-16 sm:h-20 p-2 rounded-xl text-left transition-all cursor-pointer relative flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : isToday
                        ? 'bg-slate-100/80 border-slate-300 text-slate-900 hover:bg-slate-100'
                        : 'bg-white border-slate-200/80 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {dayNumber}
                      </span>
                      {isToday && !isSelected && (
                        <span className="text-[9px] px-1 py-0.2 rounded font-semibold bg-slate-200 text-slate-700">
                          Today
                        </span>
                      )}
                    </div>

                    <div>
                      {isSelected ? (
                        <div className="text-[11px] leading-tight font-medium">
                          <span className="text-white font-bold block">
                            {dayOcc.bookedSeats} seats
                          </span>
                          <span className="text-slate-300 text-[10px] block">
                            {dayOcc.remainingSeats} free
                          </span>
                        </div>
                      ) : hasBookings ? (
                        <div className="text-[10px] text-slate-500 font-medium">
                          {dayOcc.bookedSeats} booked
                        </div>
                      ) : (
                        <div className="h-3" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: SELECTED DATE OVERVIEW (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          {clientProvidedDate && clientDateOccupancy ? (
            <>
              {/* Daily Capacity Overview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Date Overview
                    </span>
                    <h2 className="text-base font-bold text-slate-900 font-mono">
                      {new Date(clientProvidedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </h2>
                  </div>

                  <div className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                    {clientDateOccupancy.bookedSeats} / {TOTAL_VENUE_CAPACITY} Seats
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Reserved</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {clientDateOccupancy.bookedSeats} seats
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Available</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {clientDateOccupancy.remainingSeats} seats
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                    <span className="text-[10px] text-slate-500 block font-medium">Lunch</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                      {clientDateOccupancy.dayBookings
                        .filter((b) => b.time < '16:00')
                        .reduce((sum, b) => sum + b.guests, 0)}{' '}
                      / 20 seats
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                    <span className="text-[10px] text-slate-500 block font-medium">Dinner</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                      {clientDateOccupancy.dayBookings
                        .filter((b) => b.time >= '16:00')
                        .reduce((sum, b) => sum + b.guests, 0)}{' '}
                      / 30 seats
                    </div>
                  </div>
                </div>

                {clientRequest && clientRequest.requestedDate === clientProvidedDate && !isClientRequestConfirmed && (
                  <button
                    onClick={handleConfirmBooking}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs text-center block"
                  >
                    Confirm Booking for {clientRequest.clientName}
                  </button>
                )}
              </div>

              {/* Reservations List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="font-bold text-sm text-slate-900">
                    Reservations ({clientDateOccupancy.dayBookings.length})
                  </h3>
                </div>

                {clientDateOccupancy.dayBookings.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs font-semibold text-slate-700">No reservations for this date</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      All {TOTAL_VENUE_CAPACITY} seats available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {clientDateOccupancy.dayBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl transition-all flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{b.guestName}</span>
                            <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {b.guests} guests
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {b.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>{b.phone}</span>
                            <span>·</span>
                            <span>{b.seatingArea}</span>
                          </div>

                          {b.notes && (
                            <p className="text-[11px] text-slate-600 italic bg-white/70 px-2 py-0.5 rounded border border-slate-200/60 inline-block">
                              {b.notes}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                          title="Cancel reservation"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs text-center space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Select a Date</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click any date on the calendar to view seat availability and reservations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
