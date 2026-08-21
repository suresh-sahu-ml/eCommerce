ALTER TABLE wishlist ADD (
    size_id NUMBER(19,0)
);

ALTER TABLE wishlist ADD CONSTRAINT fk_wishlist_size
    FOREIGN KEY (size_id) REFERENCES product_sizes(size_id);

CREATE INDEX idx_wishlist_size_id ON wishlist(size_id);
