package com.example.backend.repository;

import com.example.backend.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Integer> {

    List<Flight> findByDepartureAirportIdAndArrivalAirportId(
        Integer departureAirportId,
        Integer arrivalAirportId
    );

    List<Flight> findByDepartureDatetimeBetween(
        LocalDateTime start,
        LocalDateTime end
    );

    List<Flight> findByFlightStatusId(Integer statusId);
}
