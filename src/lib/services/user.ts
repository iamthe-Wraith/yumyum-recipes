import { z } from 'zod';
import { HttpStatus } from '$lib/constants/error';
import { ApiError } from '$lib/error';
import { MIN_PASSWORD_LENGTH } from '$lib/constants/auth';
import { prisma } from '$lib/db/client';
import { generatePasswordHash, isValidPassword } from './auth';
import type { user_settings, users } from '@prisma/client';

export interface IUserSignInData {
  email: string;
  password: string;
}

export interface INewUserData extends IUserSignInData {
  confirmedPassword: string;
}

export interface IUpdateUserSettingsData {
  defaultServingSize: number;
}

const passwordError = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*(),.?":{}|<>)`;

const newUserSchema = z.object({
  email: z.string({
    required_error: 'Email is required.',
    invalid_type_error: 'Email must be a string.',
  })
    .email({ message: 'Invalid email address.' }),
  password: z.string({
    required_error: 'Password is required.',
    invalid_type_error: 'Password must be a string.',
  })
    .min(MIN_PASSWORD_LENGTH, { message: passwordError })
    .regex(/\d/, { message: passwordError })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: passwordError })
    .regex(/[A-Z]/, { message: passwordError })
    .regex(/[a-z]/, { message: passwordError }),
  confirmedPassword: z.string({
    required_error: 'You must confirmed your password.',
    invalid_type_error: 'Password confirmation must be a string.',
  }),
});

const signInSchema = z.object({
  email: z.string({
    required_error: 'Email is required.',
    invalid_type_error: 'Email must be a string.',
  })
    .email({ message: 'Invalid email address.' }),
  password: z.string({
    required_error: 'Password is required.',
    invalid_type_error: 'Password must be a string.',
  })
});

const userSettingsSchema = z.object({
  defaultServingSize: z.preprocess(
    (x) => parseInt(z.string().parse(x), 10),
    z.number({
      invalid_type_error: 'Default serving size must be a number.',
    })
      .positive()
      .min(1, { message: 'Default servings must be 0 or greater.' })
  ),
});

export const authenticateUser = async (email: string, password: string) => {
  try {
    validateUserSignInData({ email, password });

    const user = await prisma.users.findFirst({ where: { email }});

    if (!user) {
      throw new ApiError('Invalid email or password.', HttpStatus.UNAUTHORIZED, undefined, { email });
    }

    await isValidPassword(password, user.password);

    return user;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    } else {
      throw new ApiError('There was an error authenticating your account. Please try again later.', HttpStatus.SERVER, undefined, { email });
    }
  }
};

export const createUser = async ({ email, password, confirmedPassword }: INewUserData) => {
  try {
    await validateNewUserData({ email, password, confirmedPassword });

    const hash = await generatePasswordHash(password);

    return await prisma.$transaction(async (tx) => {
      console.log('>>>>> creating user: ', email, password);

      const user = await tx.users.create({
        data: {
          email,
          password: hash,
        }
      });

      await tx.user_settings.create({
        data: {
          defaultServingSize: 0,
          userId: user.id,
        }
      });

      return user;
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    } else {
      throw new ApiError('There was an error creating your account. Please try again later.', HttpStatus.SERVER, undefined, { email });
    }
  }
};

export const getUserSettings = (requestor: users) => {
  return prisma.user_settings.findFirst({
    where: {
      userId: requestor.id,
    }
  });
};

export const sterilizeUser = (user: users) => {
  return {
    id: user.id,
    email: user.email,
  };
};

export const updateUserSettings = (data: IUpdateUserSettingsData, requestor: users) => {
  try {
    const parsed = validateUserSettingsData(data);

    const dataToUpdate: Partial<user_settings> = {
      defaultServingSize: parsed.data.defaultServingSize,
    };

    return prisma.user_settings.update({
      where: { userId: requestor.id },
      data: dataToUpdate,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    } else {
      throw new ApiError('There was an error updating your settings. Please try again later.', HttpStatus.SERVER, undefined, { email: requestor.email });
    }
  }
};

export const validateNewUserData = async ({ email, password, confirmedPassword }: INewUserData) => {
  const parsed = newUserSchema.safeParse({ email, password, confirmedPassword });

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path[0].toString(), { email });
  }

  if (parsed.data.password !== parsed.data.confirmedPassword) {
    throw new ApiError('Passwords do not match.', HttpStatus.INVALID_ARG, 'confirmedPassword', { email });
  }

  try {
    const existingUser = await prisma.users.findFirst({ where: { email }});

    if (existingUser) {
      throw new ApiError('There is already an account with this email.', HttpStatus.CONFLICT, 'email', { email });
    }
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    } else {
      throw new ApiError('There was an error validating your data.', HttpStatus.INTERNAL_SERVER_ERROR, undefined, { email });
    }
  }

  return parsed;
};

export const validateUserSettingsData = ({ defaultServingSize }: IUpdateUserSettingsData) => {
  const parsed = userSettingsSchema.safeParse({ defaultServingSize });

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path[0].toString(), { defaultServingSize });
  }

  return parsed;
};

export const validateUserSignInData = ({ email, password }: IUserSignInData) => {
  const parsed = signInSchema.safeParse({ email, password });

  if (!parsed.success) {
    const error = parsed.error.issues[0];
    throw new ApiError(error.message, HttpStatus.INVALID_ARG, error.path[0].toString(), { email });
  }

  return parsed;
};