#!/bin/sh

dotnet run --project tests/MyApp.Performance/MyApp.Performance.csproj -c Release

netstat | grep apb2-16-172.revi.https