FROM node:alpine
COPY . .
RUN npm install
RUN npm run build

CMD npm run start:prod
EXPOSE 3000