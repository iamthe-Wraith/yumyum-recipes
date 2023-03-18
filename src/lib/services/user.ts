import { z } from "zod";
import { HttpStatus } from "$lib/constants/error";
import { ApiError } from "$lib/error";
import { MIN_PASSWORD_LENGTH } from "$lib/constants/auth";

export interface INewUserData {
  email: string;
  password: string;
  confirmed: string;
}

const passwordError = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*(),.?":{}|<>)`;

const newUserSchema = z.object({
  email: z.string({
    required_error: "Email is required.",
    invalid_type_error: "Email must be a string.",
  })
    .email({ message: "Invalid email address." }),
  password: z.string({
    required_error: "Password is required.",
    invalid_type_error: "Password must be a string.",
  })
    .min(MIN_PASSWORD_LENGTH, { message: passwordError })
    .regex(/\d/, { message: passwordError })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: passwordError })
    .regex(/[A-Z]/, { message: passwordError })
    .regex(/[a-z]/, { message: passwordError }),
  confirmed: z.string({
    required_error: "You must confirm your password.",
    invalid_type_error: "Password confirmation must be a string.",
  }),
});

export const createUser = async (email: string, password: string) => {
  // TODO: create user

  console.log('>>>>> creating user: ', email, password);

  return { id: 'abc123', email };
};

export const validateNewUserData = async ({ email, password, confirmed }: INewUserData) => {
  const parsed = newUserSchema.safeParse({ email, password, confirmed });

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path[0].toString(), { email });
  }

  // TODO: check if email is already in use

  if (parsed.data.password !== parsed.data.confirmed) {
    throw new ApiError('Passwords do not match.', HttpStatus.INVALID_ARG, 'confirmed', { email });
  }

  return true;
};