export type Availability = {
  id: string;
  starts: string;
  ends: string;
  photographerId: string;
};

export type Booking = {
  id: string;
  starts: string;
  ends: string;
  photographerId: string;
};

export type Photographer = {
  id: string;
  name: string;
  availabilities: Availability[];
  bookings: Booking[];
};

export type BookingResponse = {
  photographer: { id: string; name: string };
  timeSlot: { starts: string; ends: string };
};
