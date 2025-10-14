FROM node:22-trixie-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app/
ARG NEXT_PUBLIC_API_BASE=http://ec2-54-252-208-51.ap-southeast-2.compute.amazonaws.com:5500/api/v1
RUN npm run build   
EXPOSE 3000
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
