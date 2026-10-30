package com.example.backend.repository;

import com.example.backend.entity.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlightStatusRepository extends JpaRepository<FlightStatus, Integer> {
}