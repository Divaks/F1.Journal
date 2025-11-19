# --- Етап 1: Збірка (Build) ---
FROM node:18-alpine as build-stage
WORKDIR /app

# Копіюємо спочатку package.json (для кешування)
COPY package.json package-lock.json ./
RUN npm install

# Копіюємо весь код і білдимо проєкт
COPY . .
RUN npm run build

# --- Етап 2: Production (Nginx) ---
FROM nginx:alpine as production-stage

# Копіюємо збілджені файли з першого етапу в папку Nginx
# УВАГА: Якщо ви використовуєте Vite, папка називається /dist
# Якщо create-react-app, папка називається /build. 
# Перевірте це! (За замовчуванням нижче написано dist)
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Копіюємо наш конфіг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Google Cloud Run очікує порт 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]