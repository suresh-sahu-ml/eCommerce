package com.perfumeshop.auth.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneValidator.class)
@Documented
public @interface ValidPhone {
    String message() default "Phone number must be exactly 10 digits";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
