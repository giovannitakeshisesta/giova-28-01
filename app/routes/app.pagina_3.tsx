import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { useFetcher } from "react-router";

/* -------------------- TYPES -------------------- */
type ProductEdge = {
  node: {
    id: string;
    title: string;
    featuredImage?: {
      url: string;
      altText?: string | null;
    } | null;
  };
};

/* -------------------- LOADER -------------------- */
export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query getProducts {
      products(first: 3) {
        edges {
          node {
            id
            title
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }`,
  );

  const json = await response.json();

  return {
    products: (json?.data?.products?.edges ?? []) as ProductEdge[],
  };
}

/* -------------------- PAGE -------------------- */
export default function GioPage() {
  const fetcher = useFetcher<typeof loader>();
  const products = fetcher.data?.products ?? [];

  return (
    <s-page heading="Soy el titulo de la pagina">
      <s-section>
        <s-stack>
          <s-paragraph>
            Los productos se cargan solo después de clicar
          </s-paragraph>

          <s-button
            onClick={() => fetcher.load("/app/pagina_3")}
            loading={fetcher.state === "loading"}
          >
            Cargar productos
          </s-button>
        </s-stack>
      </s-section>

      {products.length > 0 && (
        <s-section heading="Productos">
          <s-stack gap="base">
            {products.map(({ node }) => (
              <s-box padding="base" background="subdued" border="base" borderRadius="base" >
                <s-stack key={node.id}  direction="inline" alignItems="center" gap="base">
                  {node.featuredImage?.url && (
                    <img
                      src={node.featuredImage.url}
                      alt={node.featuredImage.altText ?? node.title}
                      style={{
                        maxWidth: 50,
                        height: "auto",
                        borderRadius: 8,
                      }}
                    />
                  )}
                  <s-stack>
                    <s-paragraph>
                      <strong>{node.title}</strong>
                    </s-paragraph>
                  </s-stack>
                  <s-paragraph>
                    ID: {node.id}
                  </s-paragraph>
                </s-stack>
              </s-box>
            ))}
          </s-stack>
        </s-section>
      )}
    </s-page>
  );
}
