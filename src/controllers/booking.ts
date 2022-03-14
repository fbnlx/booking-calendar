import axios from "axios";
import moment = require("moment");
import { BookingResponse, Photographer } from "types";

export default async function availableTimeSlotsForBooking(
  durationInMinutes: number
): Promise<BookingResponse[]> {
  const photographers = await axios.get<Photographer[]>(
    "http://localhost:3000/photographers?_embed=availabilities&_embed=bookings"
  );
  const availabilityResults: BookingResponse[] = [];
  for (let i = 0; i < photographers.data.length; i++) {
    const photographer = photographers.data[i];
    for (let j = 0; j < photographer.availabilities.length; j++) {
      const av = photographer.availabilities[j];
      let start = moment(av.starts);
      while (
        start
          .clone()
          .add(durationInMinutes, "minutes")
          .isBefore(moment(av.ends))
      ) {
        const conflictingBooking = photographer.bookings.find(
          (booking) =>
            (moment(booking.starts).isBefore(
              start.clone().add(durationInMinutes, "minutes")
            ) &&
              moment(booking.starts).isAfter(
                start.clone().subtract(1, "minute")
              )) ||
            (moment(booking.ends).isAfter(start) &&
              moment(booking.ends).isBefore(
                start.clone().add(durationInMinutes, "minutes")
              ))
        );
        if (conflictingBooking) {
          start = moment(conflictingBooking.ends);
        } else {
          break;
        }
      }
      if (
        start
          .clone()
          .add(durationInMinutes, "minutes")
          .isBefore(moment(av.ends))
      ) {
        availabilityResults.push({
          photographer: { id: photographer.id, name: photographer.name },
          timeSlot: {
            starts: start.toISOString(),
            ends: start.clone().add(durationInMinutes, "minutes").toISOString(),
          },
        });
        break;
      }
    }
  }

  return availabilityResults;
}
