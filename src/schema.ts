import axios from "axios";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
  GraphQLNonNull,
} from "graphql";
import { Photographer } from "types";
import availableTimeSlotsForBooking from "./controllers/booking";

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
        durationInMinutes: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        return availableTimeSlotsForBooking(parseInt(args.durationInMinutes));
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
