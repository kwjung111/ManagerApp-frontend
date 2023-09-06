FROM node:18

WORKDIR /usr/src/platform-frontend

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]