# Use alpine Node image
FROM node:alpine

# Set working directory
WORKDIR /app

# Set NODE_ENV to development to install devDependencies
ENV NODE_ENV=development

# Copy and install dependencies
COPY package*.json ./

# Force-install ALL dependencies, including dev
RUN npm install --include=dev


# Copy all source files
COPY . .

# Expose port (for completeness, not needed in test)
EXPOSE 4000

# Default test command
CMD ["npm", "test"]
