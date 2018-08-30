#!/bin/bash

cake -target=Publish

docker-compose down
docker-compose build

VERSION=0.1.1

# docker tag central-logger:latest 192.168.0.20:5050/central-logger:$VERSION
# docker push 192.168.0.20:5050/central-logger:$VERSION

docker tag central-logger:latest wearetherock/central-logger:$VERSION
docker push wearetherock/central-logger:$VERSION