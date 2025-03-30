# Etapa de build
FROM golang:1.18-alpine AS builder
RUN apk add --no-cache git
WORKDIR /src
RUN git clone https://github.com/adnanh/webhook.git
WORKDIR /src/webhook
RUN go build -o /webhook

# Etapa final
FROM alpine:latest
COPY --from=builder /webhook /usr/local/bin/webhook
EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/webhook"]
CMD ["-hooks=/etc/webhook.json", "-port=9000"]
