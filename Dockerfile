FROM node as node
WORKDIR /app
COPY src src
COPY client client
RUN npm --prefix client install
RUN npm --prefix client run build

FROM microsoft/dotnet:2.1-sdk-alpine as publish
WORKDIR /app
COPY --from=node /app .
COPY build.cake .
RUN dotnet tool install -g cake.tool
RUN ${HOME}/.dotnet/tools/dotnet-cake -target=Publish -vv=2

FROM microsoft/dotnet:2.1-aspnetcore-runtime-alpine
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
WORKDIR /app
COPY --from=publish /app/publish .
RUN dotnet --info
RUN ls .
ENV CENTRAL_LOGGER_CS="Server=bcircle.hopto.org;Port=2345;User Id=postgres; Password=05bfd455aec34d3cb7b51b01d4152cad;Database=CentralLogger;"
ENTRYPOINT ["dotnet", "CentralLogger.dll"]