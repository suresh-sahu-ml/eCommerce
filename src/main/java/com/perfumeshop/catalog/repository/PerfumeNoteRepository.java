package com.perfumeshop.catalog.repository;

import com.perfumeshop.catalog.entity.PerfumeNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerfumeNoteRepository extends JpaRepository<PerfumeNote, Long> {
    Optional<PerfumeNote> findByNoteName(String noteName);
}
