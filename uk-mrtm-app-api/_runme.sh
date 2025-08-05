#!/bin/bash

docker-compose up -d
mvn spring-boot:run -Dspring-boot.run.profiles=dev