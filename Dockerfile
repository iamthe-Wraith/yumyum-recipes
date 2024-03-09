FROM node:18.19-alpine AS build
WORKDIR /usr/app

COPY ./ ./

RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["node", "build"]