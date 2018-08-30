## Commands

```
az appservice plan create --name central-logger --resource-group central-logger --sku FREE
az webapp create --name central-logger --resource-group central-logger --plan central-logger
```