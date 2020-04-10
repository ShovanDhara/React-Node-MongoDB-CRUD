// Check environment
const env = process.env.NODE_ENV || 'development';
// Fetch env config
const config = require('./config.json');
const envConfig = config[env];
// add env config values to process environment
Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key]
})