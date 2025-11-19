# 1) Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["F1Journal.csproj", "."]
RUN dotnet restore "F1Journal.csproj"

COPY . .
RUN dotnet build "F1Journal.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 2) Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "F1Journal.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# 3) Runtime (те, чого зараз НЕМАЄ)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Render ставить PORT, тому треба дозволити слухати цей порт
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}

# Запуск
ENTRYPOINT ["dotnet", "F1Journal.dll"]
