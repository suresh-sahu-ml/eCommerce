package com.perfumeshop.contact.entity;

import com.perfumeshop.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "contact_messages")
public class ContactMessage extends BaseEntity {

    @Id
    @SequenceGenerator(name = "contact_msg_seq", sequenceName = "contact_msg_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "contact_msg_seq")
    @Column(name = "message_id")
    private Long messageId;

    @NotBlank(message = "Name is required")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @NotBlank(message = "Subject is required")
    @Column(name = "subject", nullable = false, length = 255)
    private String subject;

    @NotBlank(message = "Message is required")
    @Column(name = "message", nullable = false, columnDefinition = "CLOB")
    private String message;

    @Column(name = "is_replied", nullable = false)
    private Boolean isReplied = false;

    public ContactMessage() {
    }

    public ContactMessage(String name, String email, String subject, String message) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.isReplied = false;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsReplied() {
        return isReplied;
    }

    public void setIsReplied(Boolean isReplied) {
        this.isReplied = isReplied;
    }
}
