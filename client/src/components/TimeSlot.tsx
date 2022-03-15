import { gql } from "@apollo/client";
import React from "react";
import "./TimeSlot.css";

interface Props {
  photographer: string;
  startTime: string;
  endTime: string;
}

export const GET_AVAILABLE_TIME_SLOTS = gql`
  query Booking($durationInMinutes: String!) {
    booking(durationInMinutes: $durationInMinutes) {
      photographer {
        id
        name
      }
      timeSlot {
        starts
        ends
      }
    }
  }
`;

const getDateTimeFormat = (dateISO: string) => {
  const date = new Date(dateISO);
  const time = new Date(dateISO).toLocaleTimeString("en", {
    timeStyle: "short",
    hour12: false,
    timeZone: "UTC",
  });
  return `${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()} ${time}`;
};

export default function TimeSlot({ photographer, startTime, endTime }: Props) {
  return (
    <article className="timeslot__container">
      <h1>{photographer}</h1>
      <time>
        {getDateTimeFormat(startTime)} - {getDateTimeFormat(endTime)}
      </time>
    </article>
  );
}
