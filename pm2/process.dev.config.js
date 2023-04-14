module.exports = {
  apps: [
    {
      name: 'easyqr',
      script: './src/server/server.js',
      watch: "./",
      watch_delay: 5000,
      ignore_watch: [
        ".git",
        ".logs",
        "config",
        "pm2",
        "./*.js",
        "./*.json",
        "./*.md",
        "./src/client",
        "./src/migrations",
        "./dist"
      ],
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      error_file: ".logs/err.log",
      out_file: ".logs/out.log",
      max_restarts: 2,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'dev',
        debug: true
      },
      env_production: {
        NODE_ENV: 'production',
        debug: false
      },
      // exec_mode: "fork_mode"
      wait_ready: true,
      shutdown_with_message: true,
      instances: "3",
      exec_mode: "cluster"
    },
    {
      name: 'telegramBot',
      script: './src/server/telegram/telegramServer.js',
      watch: "./",
      watch_delay: 5000,
      ignore_watch: [
        ".git",
        ".logs",
        "config",
        "pm2",
        "./*.js",
        "./*.json",
        "./*.md",
        "./src/client",
        "./src/migrations",
        "./dist"
      ],
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      error_file: ".logs/err.log",
      out_file: ".logs/out.log",
      max_restarts: 2,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'dev',
        debug: true
      },
      env_production: {
        NODE_ENV: 'production',
        debug: false
      },
      // exec_mode: "fork_mode"
      wait_ready: true,
      shutdown_with_message: true,
      instances: "1",
      exec_mode: "cluster"
    }
  ]
};