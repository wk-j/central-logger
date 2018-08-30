## Commands

```bash
az appservice plan create --name central-logger --resource-group central-logger --sku FREE
az webapp create --name central-logger --resource-group central-logger --plan central-logger
```

```bash
gcloud beta app deploy --project central-logger-214910  publish/dist/app.yaml
y

--update-env-vars CENTRAL_LOGGER_CS=$CENTRAL_LOGGER_CS
```