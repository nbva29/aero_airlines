package com.example.backend.repository;

import com.example.backend.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AirportRepository extends JpaRepository<Airport, Integer> {

    List<Airport> findByCityId(Integer cityId);

    Optional<Airport> findByAirportCode(String airportCode);
}