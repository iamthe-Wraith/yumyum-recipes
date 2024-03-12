FROM node:18.19-alpine
WORKDIR /usr/app

COPY ./ ./

RUN npm install
RUN npx prisma generate
RUN npm run build
RUN npm run migrations

EXPOSE 3000
CMD ["node", "build"]