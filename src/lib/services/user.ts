import { HttpStatus } from '$lib/constants/error';
import { ApiError } from '$lib/error';
import { prisma } from '$lib/db/client';
import { generatePasswordHash, isValidPassword } from './auth';
import type { user_settings, users } from '@prisma/client';
import { newUserSchema, signInSchema, userSettingsSchema, type INewUserData, type IUpdateUserSettingsData, type IUserSignInData } from '$lib/schemas/user';


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