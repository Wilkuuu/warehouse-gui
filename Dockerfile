FROM node:12.13.1

RUN mkdir /app
WORKDIR /app
RUN npm install -g @angular/cli@7.1.3
COPY package.json .
RUN npm install
COPY . .
RUN ng build --prod

FROM nginx:alpine
ADD ./docker-config/nginx-site.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /var/www/html
RUN mkdir -p /var/www/html

WORKDIR /var/www/html

COPY --from=0 /app/dist /var/www/html
