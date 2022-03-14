import axios from "axios";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
  GraphQLNonNull,
} from "graphql";
import moment = require("moment");
import { Booking, BookingResponse, Photographer } from "types";

const AvailabilityType = new GraphQLObjectType({
  name: "Availability",
  fields: {
    starts: { type: GraphQLString },
    ends: { type: GraphQLString },
  },
});

const BookingType = new GraphQLObjectType({
  name: "Booking",
  fields: {
    id: { type: GraphQLID },
    starts: { type: GraphQLString },
    ends: { type: GraphQLString },
    photographerId: { type: GraphQLID },
  },
});

const PhotographerType = new GraphQLObjectType({
  name: "Photographer",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

const TimeSlotType = new GraphQLObjectType({
  name: "TimeSlot",
  fields: {
    starts: { type: GraphQLString },
    ends: { type: GraphQLString },
  },
});

const BookingResponseType = new GraphQLObjectType({
  name: "BookingResponse",
  fields: {
    photographer: { type: PhotographerType },
    timeSlot: { type: TimeSlotType },
  },
});

const PhotographerExtendedType = new GraphQLObjectType({
  name: "PhotographerExtended",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    availabilities: { type: new GraphQLList(AvailabilityType) },
    bookings: { type: new GraphQLList(BookingType) },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    photographer: {
      type: PhotographerExtendedType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(_, args) {
        const res = await axios.get<Photographer>(
          `http://localhost:3000/photographers/${args.id}?_embed=availabilities`
        );
        return res.data;
      },
    },
    photographers: {
      type: new GraphQLList(PhotographerExtendedType),
      async resolve(_, args) {
        const res = await axios.get<Photographer[]>(
          "http://localhost:3000/photographers?_embed=availabilities&_embed=bookings"
        );
        return res.data;
      },
    },
    booking: {
      type: new GraphQLList(BookingResponseType),
      args: {
        duration: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        const duration = parseInt(args.duration);
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
              start.clone().add(duration, "minutes").isBefore(moment(av.ends))
            ) {
              const conflictingBooking = photographer.bookings.find(
                (booking) =>
                  (moment(booking.starts).isBefore(
                    start.clone().add(duration, "minutes")
                  ) &&
                    moment(booking.starts).isAfter(
                      start.clone().subtract(1, "minute")
                    )) ||
                  (moment(booking.ends).isAfter(start) &&
                    moment(booking.ends).isBefore(
                      start.clone().add(duration, "minutes")
                    ))
              );
              if (conflictingBooking) {
                start = moment(conflictingBooking.ends);
              } else {
                break;
              }
            }
            if (
              start.clone().add(duration, "minutes").isBefore(moment(av.ends))
            ) {
              availabilityResults.push({
                photographer: { id: photographer.id, name: photographer.name },
                timeSlot: {
                  starts: start.toISOString(),
                  ends: start.clone().add(duration, "minutes").toISOString(),
                },
              });
              break;
            }
          }
        }

        return availabilityResults;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
