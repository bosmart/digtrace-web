FROM debian:stretch-slim AS builder
#
#RUN apt-get update \
#	&& apt-get install -y git
#
#RUN apt-get update \
#	&& apt-get install -y curl \
#	&& curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh \
#	&& bash nodesource_setup.sh \
#    && apt-get install -y nodejs \
#	&& npm install -g @angular/cli \
#	&& npm install --save-dev @angular-devkit/build-angular \
#	&& npm install bootstrap \
#	&& npm install bootstrap \
#	&& npm install ngx-notification --save \
#	&& npm install ngx-spinner --save \
#	&& npm install ngx-pagination --save \
#	&& npm install ngx-perfect-scrollbar --save
#
#
##@6.2.4
#ADD . /digtraceproweb/
#
#
#RUN cd /digtraceproweb \
#	&& ng build --prod

FROM nginx:1.17.2-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*
COPY /dist/. /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
