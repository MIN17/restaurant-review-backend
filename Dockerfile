# bun official image
FROM oven/bun:1-alpine

# set working directory
WORKDIR /app

# copy package files
COPY package.json bun.lockb* ./

# install dependencies
RUN bun install

# copy source code
COPY . .

# expose port
EXPOSE 3000

# start application
CMD ["bun", "run", "dev"]