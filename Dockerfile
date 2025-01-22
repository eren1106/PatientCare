FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .


# Set environment variables
ENV VITE_API_URL=http://localhost:3000/api
ENV VITE_SERVER_URL=http://localhost:3000
ENV VITE_AUTO_INIT_DEVICE=false

# Expose port 5000
EXPOSE 5000

# Start dev server with custom port
CMD ["npm", "run", "dev", "--", "--host", "--port", "5000"]