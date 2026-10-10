import { z } from "zod";
import { JOB_TITLE_MAX_LENGTH } from "./constants";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[a-zA-Z\s'.-]+$/;

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .min(2, "Must be at least 2 characters")
    .regex(namePattern, "Only letters are allowed");

export const leadSchema = z.object({
  first_name: nameField("First name"),
  last_name: nameField("Last name"),
  email: z.string().trim().min(1, "Email is required").regex(emailPattern, "Enter a valid email address"),
  job: z.string().trim().max(JOB_TITLE_MAX_LENGTH, `Job title must be under ${JOB_TITLE_MAX_LENGTH} characters`),
});
