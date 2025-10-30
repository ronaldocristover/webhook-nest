import { ValidationError } from '@nestjs/common';

export function flattenValidationErrors(
  validationErrors: ValidationError[],
  parentPath = '',
): any[] {
  const result = [];

  for (const error of validationErrors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      // Push each constraint as an individual error message
      for (const [constraintKey, message] of Object.entries(
        error.constraints,
      )) {
        result.push({
          property: propertyPath,
          message,
        });
      }
    }

    if (error.children && error.children.length > 0) {
      // Recursively process children
      result.push(...flattenValidationErrors(error.children, propertyPath));
    }
  }

  return result;
}
