FROM node:22-trixie-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app/
ARG NEXT_PUBLIC_API_BASE=https://api.inkbid.store/api/v1
ARG NEXT_PUBLIC_SOCKET_BASE=https://socket.inkbid.store
ARG NEXT_PUBLIC_AI_BASE=https://ai.inkbid.store
RUN npm run build   
EXPOSE 3000
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
