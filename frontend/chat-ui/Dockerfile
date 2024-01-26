FROM node:20-alpine as deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of files
COPY . .
RUN npm run build

# Start app
EXPOSE 8080
CMD ["npm", "start"]