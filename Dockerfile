# build stage
FROM node:18-alpine as builder

# set work directory
WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# set environment variables
ENV VITE_API_URL="http://localhost:3000/api"
ENV VITE_SERVER_URL="http://localhost:3000"

# build app
RUN npm run build

# production stage
FROM nginx:alpine

# copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# copy nginx config
RUN echo 'server { \
    listen 5000; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# expose port 5000
EXPOSE 5000

# start nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]