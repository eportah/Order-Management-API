# 1. Use an official Node.js runtime as the base image
FROM node:24-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package files first to leverage Docker caching
COPY package*.json ./

# 4. Install production dependencies from the lockfile
RUN npm ci --omit=dev

# 5. Copy the application source code into the container
COPY . .

# 6. Document the application's default port
EXPOSE 3000

# 7. Start the application
CMD ["node", "index.js"]