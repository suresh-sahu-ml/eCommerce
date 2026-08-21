CREATE SEQUENCE contact_msg_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE contact_messages (
    message_id NUMBER(19,0) PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    email VARCHAR2(255) NOT NULL,
    subject VARCHAR2(255) NOT NULL,
    message CLOB NOT NULL,
    is_replied CHAR(1) NOT NULL DEFAULT '0',
    created_date TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_email ON contact_messages(email);
CREATE INDEX idx_contact_is_replied ON contact_messages(is_replied);
