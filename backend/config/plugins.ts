export default ({ env }) => ({
  upload: {
    config: {
      provider: env("UPLOAD_PROVIDER", "local"),
      providerOptions:
        env("UPLOAD_PROVIDER", "local") === "cloudinary"
          ? {
              cloud_name: env("CLOUDINARY_NAME"),
              api_key: env("CLOUDINARY_KEY"),
              api_secret: env("CLOUDINARY_SECRET"),
            }
          : {},
      actionOptions: {
        upload: {
          folder: env("CLOUDINARY_FOLDER", "recipes"),
        },
        delete: {},
      },
    },
  },
});
