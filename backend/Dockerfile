FROM node:22-trixie-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app/
EXPOSE 5500
CMD ["npm", "run", "start"]