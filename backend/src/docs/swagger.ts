import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'CareerSathi API Documentation',
      version: '1.0.0',
      description: 'Production API documentation for the CareerSathi portal.',
      contact: {
        name: 'CareerSathi Engineering Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
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
  // Look for swagger definitions in route files
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
