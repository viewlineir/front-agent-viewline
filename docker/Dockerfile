# ---------- Stage 1: Build ----------
FROM node:20 AS build
WORKDIR /app

# نصب dependencies
COPY package*.json ./
RUN npm ci
COPY . .

# آرگومان و متغیر محیطی برای انتخاب نوع build
# مقدار BUILD_CMD از Environment (مثل دارکوب) گرفته می‌شود
ARG BUILD_CMD
#ENV BUILD_CMD=${BUILD_CMD}

# حذف ||file: از SCSS قبل از build (فقط داخل Docker)
RUN find src -type f -name '*.scss' -exec sed -i 's/||file://g' {} \;

# اجرای build با مقدار پارامتریک
RUN echo "Running npm run ${BUILD_CMD}" && npm run ${BUILD_CMD}

# ---------- Stage 2: Runtime (Nginx) ----------
FROM nginx:alpine

# کانفیگ Nginx برای SPA (history mode)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# کپی خروجی build
COPY --from=build /app/dist /tmp/dist

# پیدا کردن مسیر نهایی خروجی و انتقال به html
RUN set -eux; \
    DEST=/usr/share/nginx/html; \
    rm -rf "$DEST"/*; \
    if [ -d /tmp/dist/browser ]; then \
      cp -r /tmp/dist/browser/* "$DEST/"; \
    else \
      SUB=$(find /tmp/dist -maxdepth 2 -type d -name browser | head -n1 || true); \
      if [ -n "$SUB" ]; then \
        cp -r "$SUB"/* "$DEST/"; \
      else \
        ROOT=$(find /tmp/dist -maxdepth 1 -mindepth 1 -type d | head -n1 || true); \
        if [ -n "$ROOT" ]; then cp -r "$ROOT"/* "$DEST/"; else cp -r /tmp/dist/* "$DEST/" || true; fi; \
      fi; \
    fi

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
