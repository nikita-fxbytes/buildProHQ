import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MESSAGES } from '../constants/messages';
import { htmlToPlainText } from '../utils/rich-text';

/**
 * Validates task description using the same plain-text rules as the frontend
 * (non-empty meaningful text, min 3 characters after HTML stripping).
 */
@ValidatorConstraint({ name: 'IsRichTaskDescription', async: false })
export class IsRichTaskDescriptionConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const plain = htmlToPlainText(value);
    return plain.length >= 3;
  }

  defaultMessage(args: ValidationArguments): string {
    const value = args.value;
    if (typeof value !== 'string') {
      return MESSAGES.TASK_VALIDATION.DESCRIPTION_REQUIRED;
    }
    const plain = htmlToPlainText(value);
    if (!plain) {
      return MESSAGES.TASK_VALIDATION.DESCRIPTION_REQUIRED;
    }
    return MESSAGES.TASK_VALIDATION.DESCRIPTION_MIN;
  }
}
