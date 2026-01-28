import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`query { shop { name } }`);

  const json = await response.json();
  return { nombreTienda: json?.data?.shop.name };
}

export default function GioPage() {
  const { nombreTienda } = useLoaderData<typeof loader>();
  return (
    <s-page heading="LOADERS - nombre tienda">
      <s-section heading="Que hacemos: buscar nombre tienda y pintarlo.">
        <s-stack gap="base">

          <s-paragraph>
            1 - data fetching server-side utilizando una function "loader"
            <s-unordered-list>
              <s-list-item>authenticate</s-list-item>
              <s-list-item>query nombre tienda</s-list-item>
              <s-list-item>guardamos datos en un json</s-list-item>
            </s-unordered-list>
          </s-paragraph>

          <s-paragraph>
            2 - consumir eso en la UI.
            <s-unordered-list>
              <s-list-item>render: utilizando el hook "useLoaderData()"</s-list-item>
            </s-unordered-list>
          </s-paragraph>

          <s-divider />

          <s-box
            padding="base"
            background="subdued"
            border="base"
            borderRadius="base"
          >
            <s-paragraph>Nombre tienda: {nombreTienda}</s-paragraph>
          </s-box>
        </s-stack>
      </s-section>
    </s-page>
  );
}

/*
GET DATA:
    LOADER
    export async function loader({ request }: LoaderFunctionArgs)
        Esto es React Router Data API (muy estilo Remix):
            -Se ejecuta antes de renderizar la página
            -Corre en el servidor, nunca en el navegador
            -Recibe el request HTTP real

        Aquí es donde:
            -autenticas
                const { admin } = await authenticate.admin(request);
                    -Verifica que la request viene de una tienda válida
                    -Recupera una sesión válida
                    -Te da un cliente Admin API ya autenticado
            -llamas a APIs
                const response = await admin.graphql(
                `query { shop { name } }`,
                );
                    - Usas la Admin GraphQL API
                    - Pides datos de la tienda (shop.name)
                    - Shopify responde como JSON estándar


            -decides qué datos llegan al componente


RENDER DATA       
    USELOADERDATA: puente servidor → React
    const { nombreTienda } = useLoaderData<typeof loader>();

*/
