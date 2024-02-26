FROM node:21.6-alpine AS build
WORKDIR /usr/app

COPY ./ ./

RUN npm install
RUN npm run build

FROM node:21.6-alpine
WORKDIR /usr/app

COPY --from=build /usr/app/package.json ./
COPY --from=build /usr/app/package-lock.json ./
COPY --from=build /usr/app/build ./build

RUN npm install --omit dev
RUN npx prisma migrate deploy

EXPOSE 3000
CMD ["node", "build"]

