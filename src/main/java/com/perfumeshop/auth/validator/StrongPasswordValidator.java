package com.perfumeshop.auth.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    private static final String PASSWORD_PATTERN =
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        boolean isValid = pattern.matcher(value).matches();

        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                "Password must contain: " +
                "• At least 8 characters\n" +
                "• 1 uppercase letter (A-Z)\n" +
                "• 1 lowercase letter (a-z)\n" +
                "• 1 number (0-9)\n" +
                "• 1 special character (!@#$%^&*)"
            ).addConstraintViolation();
        }

        return isValid;
    }
}
