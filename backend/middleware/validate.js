const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })) 
      });
    }
    return res.status(400).json({ error: 'Invalid request payload' });
  }
};

module.exports = validate;
