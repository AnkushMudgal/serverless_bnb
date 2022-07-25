FROM node:alpine

WORKDIR /usr/src/app

# frontend build starts

COPY frontend .

RUN npm install

RUN npm run build

RUN rm -rf public src node_modules

RUN rm package.json package-lock.json

# frontend build end


# backend build starts

COPY backend .

RUN npm install

# backend build end

EXPOSE 3001

CMD ["npm", "start"]