FROM armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/node:18.19.0-alpine as base

RUN mkdir -p /user/source/app

WORKDIR /user/source/app

COPY ./oris/frontend/package.json /user/source/app

RUN npm config set @eds:registry https://arm.rnd.ki.sw.ericsson.se/artifactory/api/npm/proj-eds-npm-local

RUN npm install \
&& npm prune \
&& npm cache verify

COPY oris/frontend/package.json /user/source/app

RUN npm install -g @angular/cli

COPY oris/frontend/ /user/source/app/

CMD ["ng", "serve", "--host", "0.0.0.0"]
