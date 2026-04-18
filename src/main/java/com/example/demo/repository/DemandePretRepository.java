package com.example.demo.repository;

import com.example.demo.entity.DemandePret;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DemandePretRepository extends JpaRepository<DemandePret, Long> {
    List<DemandePret> findByClientId(Long clientId);
}
