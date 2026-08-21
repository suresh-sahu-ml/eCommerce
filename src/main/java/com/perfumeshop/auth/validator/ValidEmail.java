package com.perfumeshop.auth.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EmailValidator.class)
@Documented
public @interface ValidEmail {
    String message() default "Email should be valid (format: name@domain.com)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
