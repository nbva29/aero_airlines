package com.example.backend.repository;

import com.example.backend.entity.Citizenship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitizenshipRepository extends JpaRepository<Citizenship, Integer> {
}