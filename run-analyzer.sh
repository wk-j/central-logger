#!/bin/sh

dotnet-sonarscanner begin /k:"central-logger" /d:sonar.organization="wk-j-github" /d:sonar.host.url="https://sonarcloud.io" /d:sonar.login=$sonario /d:sonar.cs.opencover.reportsPaths=%reportPath%
dotnet test tests/CentralLogger.Tests/CentralLogger.Tests.csproj /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
dotnet-sonarscanner end /d:sonar.login=$sonario