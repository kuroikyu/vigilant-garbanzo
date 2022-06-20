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
  products.forEach((product) => {
    const result = getSubstituteProductRecursive({
      products,
      initialPosition: products.indexOf(product),
      currentPosition: undefined,
      now,
      productsIndexed,
    });

    if (result === -1) {
      productsWithErrors.push(product.id);
    } else if (result) {
      map.set(product.id, result);
    }
  });

  return { map, productsWithErrors };
}

interface GetSubstituteProductRecursive {
  products: ReadonlyArray<Product>;
  initialPosition: number;
  currentPosition: number | undefined;
  now: Date;
  productsIndexed: Map<Product['id'], Product>;
}

function getSubstituteProductRecursive({
  products,
  initialPosition,
  currentPosition,
  now = new Date(),
  productsIndexed,
}: GetSubstituteProductRecursive): string | undefined | -1 {
  // ERROR: Circular reference
  if (initialPosition === currentPosition) {
    return -1;
  }

  const currentProduct = products[currentPosition ?? initialPosition];
  const trueOrUndefined = typeof currentPosition === 'undefined' ? undefined : true;

  // ERROR: No replacementId but replacement date is set in the past
  if (
    !currentProduct.replacementProductId &&
    currentProduct.replacementDate &&
    dateFns.isBefore(currentProduct.replacementDate, now)
  ) {
    return -1;
  }

  // currentPosition ?
  // undefined  - RESULT: No substitute found
  // value      - RESULT: Substitute found
  if (!currentProduct.replacementProductId) {
    return trueOrUndefined && currentProduct.id;
  }

  // ERROR: Replacement but no replacement date
  if (!currentProduct.replacementDate) {
    return -1;
  }

  // currentPosition ?
  // undefined  - RESULT: No need to be replaced yet
  // value      - RESULT: Substitute found that hasn't expired yet
  if (dateFns.isAfter(currentProduct.replacementDate, now)) {
    return trueOrUndefined && currentProduct.id;
  }

  const replacementProduct = productsIndexed.get(currentProduct.replacementProductId);

  // ERROR: replacementProductId not valid
  if (!replacementProduct) {
    return -1;
  }

  return getSubstituteProductRecursive({
    products,
    initialPosition,
    currentPosition: products.indexOf(replacementProduct),
    now,
    productsIndexed,
  });
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
