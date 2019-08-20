# Based on https://github.com/plone/volto/blob/master/entrypoint.sh

FROM node:10.14.2-slim

RUN apt-get update -y
RUN apt-get install -y git

WORKDIR /opt/fise/
COPY . .
COPY volto /volto
RUN yarn install

COPY entrypoint-dev.sh entrypoint.sh

RUN chmod +x entrypoint.sh
RUN RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn build

ENTRYPOINT ["/opt/fise/entrypoint.sh"]
CMD yarn start:prod
