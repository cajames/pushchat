# STAGE 1 => CLIENT BUILD
FROM node:10 as frontend
WORKDIR /app
# Copy the frontend directory contents into the container at /app
COPY ./client /app
RUN yarn && yarn build

# STAGE 2 => SERVER BUILD
FROM node:10-alpine
WORKDIR /app
COPY ./server /app
EXPOSE 3000
RUN yarn

# Copy built client from first stage to second stage
COPY --from=frontend /app/dist ./public
CMD ["yarn", "start"]
