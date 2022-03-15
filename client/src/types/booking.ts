type Photographer = {
  id: string;
  name: string;
};
type Availability = {
  starts: string;
  ends: string;
};

export interface Booking {
  photographer: Photographer;
  timeSlot: Availability;
}

export interface BookingData {
  booking: Booking[];
}

export interface BookingVars {
  durationInMinutes: string;
}
