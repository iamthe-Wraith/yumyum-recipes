FROM node:21.6-alpine AS build
WORKDIR /usr/app

COPY . ./

ENV SENTRY_LOG_LEVEL=debug
ENV SENTRY_RELEASE=yumyum@0.0.1

RUN npm install
RUN npm run build
RUN npx prisma migrate deploy

FROM node:21.6-alpine
WORKDIR /usr/app

COPY --from=build /usr/app/package.json /usr/app/package.json
COPY --from=build /usr/app/package-lock.json /usr/app/package-lock.json
COPY --from=build /usr/app/build /usr/app/build

EXPOSE 3000
CMD ["node", "build/index.js"]
