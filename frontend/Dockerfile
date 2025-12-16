FROM node:22-trixie-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app/
ARG NEXT_PUBLIC_API_BASE=http://localhost:5500/api/v1
ARG NEXT_PUBLIC_SOCKET_BASE=https://localhost:5500
ARG NEXT_PUBLIC_AI_BASE=http://localhost:5050
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
