FROM armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/node:18.13.0-alpine as base

RUN mkdir -p /user/source/app

WORKDIR /user/source/app

COPY oris/* /user/source/app

WORKDIR /user/source/app/frontend

RUN npm install

RUN npm install -g @angular/cli

CMD ["ng", "serve", "--host", "0.0.0.0"]