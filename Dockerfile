# Based on https://github.com/plone/volto/blob/master/entrypoint.sh

FROM node:10.14.2-slim

RUN apt-get update -y
RUN apt-get install -y git

WORKDIR /opt/energyunion/

COPY package.json .
RUN yarn install

COPY . .
RUN rm -f package.json.lock

RUN RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn build

COPY entrypoint-prod.sh entrypoint.sh
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/opt/energyunion/entrypoint.sh"]
EXPOSE 3000
CMD yarn start:prod
