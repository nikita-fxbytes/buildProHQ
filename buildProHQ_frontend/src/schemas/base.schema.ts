import { z } from "zod";
import { MESSAGES } from "@/constants/messages";

export const nonEmptyString = z
  .string()
  .trim()
  .min(1, MESSAGES.validation.fieldRequired);

export const emailString = z
  .string()
  .trim()
  .email(MESSAGES.validation.emailInvalid);

