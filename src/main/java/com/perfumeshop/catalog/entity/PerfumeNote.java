package com.perfumeshop.catalog.entity;

import com.perfumeshop.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "perfume_notes")
public class PerfumeNote extends BaseEntity {

    @Id
    @SequenceGenerator(name = "perfume_note_seq", sequenceName = "perfume_note_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "perfume_note_seq")
    @Column(name = "note_id")
    private Long noteId;

    @NotBlank(message = "Note name is required")
    @Column(name = "note_name", nullable = false, unique = true, length = 100)
    private String noteName;

    @Column(name = "description", length = 500)
    private String description;

    public PerfumeNote() {
    }

    public PerfumeNote(String noteName, String description) {
        this.noteName = noteName;
        this.description = description;
    }

    public Long getNoteId() {
        return noteId;
    }

    public void setNoteId(Long noteId) {
        this.noteId = noteId;
    }

    public String getNoteName() {
        return noteName;
    }

    public void setNoteName(String noteName) {
        this.noteName = noteName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
