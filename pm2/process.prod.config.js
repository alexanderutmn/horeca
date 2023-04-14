module.exports = {
  apps: [
    {
      name: 'cfi.ans.aero',
      script: './src/server/server.js',
      log_date_format: "YYYY-MM-DD HH:mm Z",
      merge_logs: true,
      error_file: ".logs/err.log",
      out_file: ".logs/out.log",
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'dev'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};