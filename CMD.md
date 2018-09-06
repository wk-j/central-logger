## Commands

```bash
az appservice plan create --name central-logger --resource-group central-logger --sku FREE
az webapp create --name central-logger --resource-group central-logger --plan central-logger

az webapp log tail --name central-logger --resource-group central-logger
```

```bash
gcloud beta app deploy --project central-logger-214910  publish/dist/app.yaml
y

gcloud app browse --project=central-logger-214910

```