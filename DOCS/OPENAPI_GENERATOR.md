# OpenAPI Client Generation

This project uses [OpenAPI Generator](https://openapi-generator.tech/) to automatically generate the API client services and models based on the Apache Fineract Swagger specification.

## Configuration

The generator is configured in `package.json` and uses custom templates located in `templates/openapi-generator/`.

- **Output Directory**: `src/app/api/`
- **Spec Source**: `public/api/fineract.json` (copied to `api-spec/fineract.json` during generation)
- **Custom Templates**: `templates/openapi-generator/licenseInfo.mustache` (adds Apache License header to all files)

## Commands

### Generate the API Client

To (re)generate the API client, run:

```bash
npm run generate-api
```

This command will:

1. Copy the current Swagger spec from `public/api/fineract.json`.
2. Run the OpenAPI generator with the `typescript-angular` generator.
3. Apply the custom license header template.

### Update the Swagger Spec

If the Fineract API changes, update the `public/api/fineract.json` file and then run `npm run generate-api`.

## Maintenance

### Custom Templates

If you need to customize the generated code further (e.g., adding common interceptors or changing the way models are generated), you can add more `.mustache` files to the `templates/openapi-generator/` directory.

### Ignoring Files

To prevent the generator from overwriting or creating certain files, add them to the `.openapi-generator-ignore` file in the root of the project. Currently ignored:

- `git_push.sh`
- `README.md` (inside `src/app/api/`)
- `.gitignore` (inside `src/app/api/`)
