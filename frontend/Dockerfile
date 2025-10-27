FROM node:22-trixie-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app/
ARG NEXT_PUBLIC_API_BASE=api.inkbid.store
ARG NEXT_PUBLIC_SOCKET_BASE=socket.inkbid.store
ARG NEXT_PUBLIC_AI_BASE=ai.inkbid.store
RUN npm run build   
EXPOSE 3000
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
