import Joi from 'joi';

export const portfolioSchema = Joi.object({
  tagline: Joi.string().required().max(100),
  about: Joi.string().required().max(1000),
  theme: Joi.string().valid('light', 'dark', 'system').default('dark'),
  featuredProjects: Joi.array().items(
    Joi.object({
      title: Joi.string().required().max(100),
      techStack: Joi.array().items(Joi.string()).required(),
      description: Joi.string().required().max(500),
      url: Joi.string().uri().allow('', null).optional()
    })
  ).max(5).default([])
});

export const updatePortfolioSchema = portfolioSchema.fork(
  Object.keys(portfolioSchema.describe().keys),
  (schema) => schema.optional()
);
