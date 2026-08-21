CREATE SEQUENCE wishlist_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE wishlist (
    wishlist_id NUMBER(19,0) PRIMARY KEY,
    user_id NUMBER(19,0) NOT NULL,
    product_id NUMBER(19,0) NOT NULL,
    created_date TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);
