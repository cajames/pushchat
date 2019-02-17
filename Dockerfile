# STAGE 1 => FRONTEND BUILD
FROM node:10 as frontend
WORKDIR /app
# Copy the frontend directory contents into the container at /app
COPY ./client /app
RUN yarn && yarn build

# STAGE 2 => PORTAL API BUILD
FROM node:10-alpine
WORKDIR /app
COPY ./server /app
EXPOSE 3000
RUN apk add tzdata && \
  cp /usr/share/zoneinfo/Australia/Sydney /etc/localtime && \
  echo "Australia/Sydney" > /etc/timezone && \
  date && \
  yarn
# Copy built frontend from first stage
COPY --from=frontend /app/dist ./public
CMD ["yarn", "start"]
