import { faker } from '@faker-js/faker';

export interface IMockSignIn {
  email: string;
  password: string;
}

export interface IMockNewUser extends IMockSignIn {
  confirmedPassword: string;
}

export interface IMockUserSettings {
  defaultServingSize: number;
}

export const getNewUser = () => {
  const data = getSignIn();

  return {
    ...data,
    confirmedPassword: data.password,
  };
};

export const getSignIn = () => {
  return {
    email: faker.internet.email(),
    password: 'Password123!',
  };
};

export const getUserSettings = () => {
  return {
    defaultServingSize: faker.number.int({ min: 1, max: 10 }),
  };
};