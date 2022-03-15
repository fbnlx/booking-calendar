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

export default function TimeSlot({ photographer, startTime, endTime }: Props) {
  return (
    <article>
      <h1>{photographer}</h1>
      <time>
        {startTime} - {endTime}
      </time>
    </article>
  );
}
