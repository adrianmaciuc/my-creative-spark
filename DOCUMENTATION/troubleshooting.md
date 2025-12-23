## 🔧 Troubleshooting Guide

### Common Issues

**Issue**: Strapi won't start

- Solution: Delete `.tmp` folder and restart
- Check Node.js version (needs 18+)

**Issue**: Images not displaying

- Solution: Check CORS settings in Strapi
- Verify image URLs in browser DevTools

**Issue**: Search not working

- Solution: Check API permissions (find, findOne enabled)
- Verify Strapi is running

**Issue**: Build fails

- Solution: Delete `node_modules` and `dist` folders
- Run `npm install` again
- Check for TypeScript errors

**Issue**: Railway deployment fails

- Solution: Check environment variables
- Verify DATABASE_URL is correct
- Check build logs for specific errors
