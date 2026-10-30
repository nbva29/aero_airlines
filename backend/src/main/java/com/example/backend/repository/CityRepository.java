package com.example.backend.repository;

import com.example.backend.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Integer> {

    List<City> findByCountryId(Integer countryId);
}