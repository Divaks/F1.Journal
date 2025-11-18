# ...
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src # Тепер /src - це робоча директорія

# 1. Копіюємо .csproj для відновлення. Копіюємо у поточну директорію /src
COPY ["F1Journal.csproj", "."] 
RUN dotnet restore "F1Journal.csproj"

# 2. Копіюємо решту файлів.
COPY . .

# 3. Виконання build і publish
# Ми вже знаходимося у /src, де лежить F1Journal.csproj.
RUN dotnet build "F1Journal.csproj" -c $BUILD_CONFIGURATION -o /app/build 

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "F1Journal.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
# ...
