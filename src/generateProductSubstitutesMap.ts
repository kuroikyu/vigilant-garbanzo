import * as dateFns from 'date-fns';
import * as lodash from 'lodash';

export type Product = {
  id: string;
  replacementProductId?: string;
  replacementDate?: Date;
} & Record<keyof any, any>;

type ProductsMap = Map<Product['id'], Product['id']>;
type Returned = {
  map: ProductsMap;
  productsWithErrors?: Array<Product['id']>;
};

/**
 *
 * @param products All shopify products, with typical properties and with discontinued product as "pointer" to other product
 */
export function generateProductSubstitutesMap(
  products: ReadonlyArray<Product>,
  now: Date = new Date()
): Returned {
  const map: ProductsMap = new Map();
  const productsWithErrors: string[] = []; //Dont touch this
  const productsIndexed = generateProductsByIdIndex(products); //This is for getting a product by id with O(1) cost

  // YOUR CODE GOES HERE

  return { map, productsWithErrors };
}

/**
 * This generates a index for searching products with cost O(1)
 * The key is the product id and will always return the product if you use a correct productId
 *
 * @param products The list of products
 * @returns
 */
function generateProductsByIdIndex(products: ReadonlyArray<Product>): Map<Product['id'], Product> {
  return new Map(lodash.map(products, (product) => [product.id, product]));
}

export default generateProductSubstitutesMap;
