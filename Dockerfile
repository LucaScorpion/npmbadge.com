FROM node:20 AS build

WORKDIR /app
ADD . .

RUN npm ci
RUN npm run build

# Install again to remove dev packages.
ENV NODE_ENV="production"
RUN npm i

FROM node:20

WORKDIR /app
ENV NODE_ENV="production"

COPY --from=build /app/node_modules/ node_modules/
COPY --from=build /app/build/ build/
COPY --from=build /app/fonts/ fonts/
COPY --from=build /app/_site/ _site/

EXPOSE 3000
ENTRYPOINT ["node", "./build/index.js"]
