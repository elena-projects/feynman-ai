# Serve the single-file Feynman app on Cloud Run, with nginx standing in for the
# old Vercel serverless proxy. Moving off Vercel is what makes big uploads possible:
# a Vercel function caps the request body at 4.5MB, Cloud Run allows 32MB.
FROM nginx:1.27-alpine
# nginx.conf is a template — the base image runs envsubst over /etc/nginx/templates/*.template
# at start-up. The filter limits substitution to GEMINI_API_KEY so nginx's own $host,
# $arg_model and friends survive.
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV NGINX_ENVSUBST_FILTER=GEMINI_API_KEY
COPY public /usr/share/nginx/html
# COPY preserves the source file's mode, and index.html arrives 600 from the Mac — which
# nginx (running as its own user) cannot read, so every page load came back 403.
RUN chmod -R a+r /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
