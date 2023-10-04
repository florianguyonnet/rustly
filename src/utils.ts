export const RESULT_TYPE_RUSTLY_HASH_IDENTIFIER = '7c1ea0d8525bdc7d0676940bccd43860';
export const OPTION_TYPE_RUSTLY_HASH_IDENTIFIER = 'e7836d2371f9ab4ce65dafddf7436dd4';

export function isResultInstance(result: any) {
  const rustlyHashIdentifier = getRustlyHashIdentifier(result);
  return rustlyHashIdentifier ? rustlyHashIdentifier === RESULT_TYPE_RUSTLY_HASH_IDENTIFIER : false;
}

export function isOptionInstance(result: any) {
  const rustlyHashIdentifier = getRustlyHashIdentifier(result);
  return rustlyHashIdentifier ? rustlyHashIdentifier === OPTION_TYPE_RUSTLY_HASH_IDENTIFIER : false;
}

function getRustlyHashIdentifier(result: any) {
  if (result) {
    const hasHashIdentifierProperty = result && result.rustlyHashIdentifier;
    if (hasHashIdentifierProperty) {
      return (result as { rustlyHashIdentifier: string }).rustlyHashIdentifier;
    }
  }

  return undefined;
}
