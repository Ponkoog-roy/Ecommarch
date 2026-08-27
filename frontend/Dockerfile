FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]