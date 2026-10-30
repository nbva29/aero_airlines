package com.example.backend.repository;

import com.example.backend.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PassengerRepository extends JpaRepository<Passenger, Integer> {

    List<Passenger> findByUserId(Integer userId);
}