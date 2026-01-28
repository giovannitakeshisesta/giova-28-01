export default function GioPage() {
 
  return (
    <s-page heading="Soy el titulo de la pagina">

      <s-section heading="Titulo de la seccion en negrita">
        <s-paragraph>
          Soy un parrafo Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium, commodi.
        </s-paragraph>
        <s-paragraph>
          Soy otro parrafo con Link Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium, commodi, {" "}
          <s-link
            href="https://shopify.dev/docs/apps/tools/app-bridge"
            target="_blank"
          >
            Soy un Link
          </s-link>
          .
        </s-paragraph>
      </s-section>

      <s-section heading="Soy otra seccion como la de arriba">
        <s-paragraph tone="critical" >
          Soy un parrafo ROJO rojo rojo.
        </s-paragraph>

 
        <s-stack gap="small" background="subdued" border="large" borderRadius="large" padding="large">      
            <s-stack gap="small" direction="inline" >      
                    <s-badge> Badge </s-badge>
                    <s-badge tone="success"> Success Badge </s-badge>
                    <s-badge tone="success" color="strong"> Success Strong Badge </s-badge>
            </s-stack>
            
                
            <s-stack gap="small"  direction="inline" >      
                <s-button>  Button </s-button>
                <s-button tone="critical" > Critical Button </s-button>
                <s-button tone="critical" variant="primary"> Primary Critical Button </s-button>
                <s-button tone="critical" variant="secondary"> secondary Critical Button </s-button>
            </s-stack>
    
            <s-button-group>
                <s-button slot="primary-action">primary-action</s-button>
                <s-button slot="secondary-actions">secondary-actions</s-button>
            </s-button-group>
    
        </s-stack>

      </s-section>


      {/* --------------------  ASIDE ------------------------ */}
      <s-section slot="aside" heading="Soy una seccion ASIDE">
        <s-unordered-list>
          <s-list-item>
            <s-link
              href="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
              target="_blank"
            >
              Soy un Link en una lista
            </s-link>
          </s-list-item>
          <s-list-item>
            <s-link
              href="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
              target="_blank"
            >
              Soy otro link en una lista
            </s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}


 