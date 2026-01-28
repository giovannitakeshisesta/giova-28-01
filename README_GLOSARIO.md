← Back to [Documentation index](README.md)

| Cosa          | Para qué sirve              | Dónde corre |
| ------------- | --------------------------- | ----------- |
| loader        | datos / lógica              | servidor    |
| action        | mutaciones                  | servidor    |
| useLoaderData | leer datos                  | cliente     |
| useFetcher    | disparar requests           | cliente     |
| useAppBridge  | hablar con Shopify Admin UI | cliente     |


## loader / action 
Un **loader** se ejecuta en el servidor → habla con Shopify API

- autenticas
  -Verifica que la request viene de una tienda válida
  -Recupera una sesión válida
  -Te da un cliente Admin API ya autenticado
- llamas a la Admin GraphQL API
- decides qué datos llegan al componente

```js
 export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`query { shop { name } }`);

  const json = await response.json();
  return { nombreTienda: json?.data?.shop.name };
}
```

## useFetcher

**useFetcher** corre en el cliente.

Es el botón rojo que el cliente tiene para hablar con el servidor **sin navegar**.

- Permite disparar lógica de servidor bajo demanda
- No cambia de ruta
- No recarga la página

### Uso básico

```js
const fetcher = useFetcher();
```

Esto devuelve un objeto que puede:

* Disparar un **loader** (`fetcher.load`)
* Disparar un **action** (`fetcher.submit`)
* Exponer el estado de la request (`fetcher.state`)
* Proporcionar los datos de respuesta (`fetcher.data`)

Todo sin cambiar de ruta.

### Dónde corre

* Vive en el **cliente**
* Ejecuta código en el **servidor**
* Mantiene el resultado en el **cliente**

Es literalmente un **cable entre capas**:
el cliente pide, el servidor ejecuta, el cliente reacciona.



## useLoaderData
**useLoaderData** corre en el cliente

Significa :  en el cliente los datos que el loader de esta ruta ya ejecutó en el servidor.”
```js
const { nombreTienda } = useLoaderData<typeof loader>();
```

## useAppBridge
**useAppBridge** corre en el cliente

Es el acceso, desde el cliente, al “sistema operativo” del Shopify Admin donde vive tu app.

 eg:Abrir editores (productos, pedidos, clientes)
```js
shopify.intents.invoke?.("edit:shopify/Product", {
  value: fetcher.data?.product?.id,
});
```
eg: Mostrar toasts nativos
```js
shopify.toast.show("Product created");
```
