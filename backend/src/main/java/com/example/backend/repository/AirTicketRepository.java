package com.example.backend.repository;

import com.example.backend.entity.AirTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AirTicketRepository extends JpaRepository<AirTicket, Integer> {

    List<AirTicket> findByPassengerId(Integer passengerId);

    List<AirTicket> findByFlightId(Integer flightId);

    boolean existsByFlightIdAndPlace(
        Integer flightId,
        String place
    );
}
