package com.example.backend.repository;

import com.example.backend.entity.Passport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PassportRepository extends JpaRepository<Passport, Integer> {

    List<Passport> findByPassengerId(Integer passengerId);
}
