export const configuration = () => ({
  port: "8081",
  database: {
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "123123",
    db: "postgres",
    ssl_ca_file: process.env.POSTGRES_CA_FILE ?? '',
  },
  mqtt: {
    host: "localhost",
    port: "1883",
    username: "admin",
    password: "1qazxsw2!@"
  }
});
