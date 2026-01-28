← Back to [Documentation index](README.md)

Aquí va la **línea del tiempo** de lo que pasa, por fases, desde que el usuario ve la página hasta que acaba todo el flujo. Lo separo en **cliente (navegador)**, **servidor (tu app)** y **Shopify (Admin API / Admin UI)**.

---

## 0) Render inicial (cliente)

1. React monta el componente `Index()`.
2. Se crea `fetcher = useFetcher()`.

   * `fetcher.state` empieza en `"idle"`.
   * `fetcher.data` es `undefined`.
3. `shopify = useAppBridge()` se inicializa (conecta con el Admin donde está embebida tu app).
4. `useEffect` queda “armado” pero **no hace nada** porque `fetcher.data?.product?.id` aún no existe.
5. En UI:

   * Se muestra el botón **Generate a product**.
   * No se muestra **Edit product** (porque `fetcher.data?.product` no existe).
   * No se muestran los JSONs.

---

## 1) Click en “Generate a product” (cliente)

6. El usuario hace click → se ejecuta:

```ts
fetcher.submit({}, { method: "POST" })
```

7. React Router lanza una request **POST** a la misma ruta **sin navegar** (la URL no cambia).
8. `fetcher.state` pasa a `"submitting"` (o `"loading"` dependiendo del momento exacto) y `isLoading` se vuelve `true`.
9. UI:

   * El botón muestra loading (spinner) por `loading: true`.

---

## 2) Entra el POST al servidor: corre `action()` (servidor)

10. React Router invoca tu `action({ request })`.

11. Primera cosa: autenticación Shopify:

```ts
const { admin } = await authenticate.admin(request);
```

* Esto valida sesión / token.
* Te da un cliente `admin` para hablar con la **Admin GraphQL API**.

---

## 3) Mutación 1: crear producto (servidor → Shopify Admin API)

12. Tu servidor llama a Shopify:

```graphql
mutation populateProduct($product: ProductCreateInput!) {
  productCreate(product: $product) { ... }
}
```

con variables `{ title: "Snowboard" }`.

13. Shopify crea el producto y responde con:

* `product.id`, `title`, `handle`, `status`
* `variants.edges[...]` (incluye la variante “default” que Shopify genera)

14. Tu servidor hace `await response.json()` y guarda el resultado en `responseJson`.

---

## 4) Preparación: sacar el ID de la variante (servidor)

15. Extraes el producto y la primera variante:

```ts
const product = responseJson.data.productCreate.product;
const variantId = product.variants.edges[0].node.id;
```

Esto es necesario porque para actualizar una variante, Shopify te pide **su ID**, que solo existe tras crearla.

---

## 5) Mutación 2: actualizar variante con precio (servidor → Shopify Admin API)

16. Segunda llamada a Shopify, ahora para actualizar variantes:

```graphql
productVariantsBulkUpdate(productId: $productId, variants: $variants)
```

con:

* `productId: product.id`
* `variants: [{ id: variantId, price: "100.00" }]`

17. Shopify actualiza la variante (le pone precio 100.00) y responde con `productVariants`.

18. Tu servidor parsea `variantResponseJson`.

---

## 6) Respuesta final del `action()` (servidor → cliente)

19. El `action()` devuelve:

```ts
return { product: ..., variant: ... }
```

20. Esa respuesta vuelve al navegador y React Router la guarda en:

* `fetcher.data.product`
* `fetcher.data.variant`

21. `fetcher.state` vuelve a `"idle"`.
22. UI:

* Se apaga el loading del botón.
* Aparece el botón **Edit product** (porque ya existe `fetcher.data.product`).
* Se renderizan los dos bloques de JSON.

---

## 7) Efecto secundario: toast (cliente → Shopify Admin UI)

23. Como `fetcher.data.product.id` pasó de `undefined` a “algo”, tu `useEffect` se dispara:

```ts
shopify.toast.show("Product created");
```

24. Shopify Admin UI muestra un toast nativo “Product created”.

Este paso ocurre **después** de recibir datos, ya en cliente.

---

## 8) Click en “Edit product” (cliente → Shopify Admin UI)

25. Si el usuario hace click en **Edit product**, llamas:

```ts
shopify.intents.invoke("edit:shopify/Product", { value: productId })
```

26. Shopify Admin abre el editor del producto (en el Admin), usando ese GID.

---

### Mini mapa mental (super útil)

* `fetcher.submit()` → “manda un POST sin navegar”
* `action()` → “corre en servidor”
* `admin.graphql()` → “habla con Shopify Admin API”
* `useEffect + useAppBridge` → “UI/UX nativa del Admin después de que haya datos”

Si lo miras como un juego de ping-pong: **cliente** (click) → **servidor** (action) → **Shopify API** (mutations) → **servidor** (return) → **cliente** (render) → **Shopify Admin UI** (toast / intents).
