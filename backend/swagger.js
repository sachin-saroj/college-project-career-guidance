const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareerSathi REST API Documentation',
      version: '1.0.0',
      description: 'Production-ready REST API for CareerSathi - AI-Powered Career Guidance Platform for Underprivileged Students',
      contact: {
        name: 'CareerSathi Engineering Team',
        url: 'https://github.com/sachin-saroj/college-project-career-guidance'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
