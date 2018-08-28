FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /app

COPY publish/dist .
ENTRYPOINT [ "dotnet", "CentralLogger.dll" ]