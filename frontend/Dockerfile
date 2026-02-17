FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./package.json
RUN npm install

COPY tsconfig.json ./tsconfig.json
COPY vite.config.ts ./vite.config.ts
COPY index.html ./index.html
COPY src ./src

ARG VITE_GRAPHQL_HTTP_URL=http://localhost:4000/graphql
ARG VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
ENV VITE_GRAPHQL_HTTP_URL=${VITE_GRAPHQL_HTTP_URL}
ENV VITE_GRAPHQL_WS_URL=${VITE_GRAPHQL_WS_URL}

RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app

COPY package.json ./package.json
RUN npm install

COPY --from=build /app/dist ./dist

EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
