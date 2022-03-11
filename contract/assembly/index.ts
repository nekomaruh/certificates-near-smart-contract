/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, logging, storage } from 'near-sdk-as'

const DEFAULT_MESSAGE = 'Hello'

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
  return storage.get<string>(accountId, DEFAULT_MESSAGE);
}

export function setGreeting(message: string): void {
  //const accountId = Context.sender
  // Use logging.log to record logs permanently to the blockchain!
  //logging.log(`Saving greeting "${message}" for account "${accountId}"`)
  //storage.set(accountId, message)
  //addCertificate(message);
  addCertificate(message);
}


/*

// Hash to generate code
function _generateFileHash(url: string): number {
  if (typeof url != 'string' || !url.length) {
    return null;
  }
  try {
    let data = url.split('');
    let result = data.reduce((h, c) => (h = c.charCodeAt(0) + (h << 6) + (h << 16) - h), 0)
    return result;
  } catch (_) {
    return null;
  }
}


export function setCertificate(name:string): void{
  var hash = _generateFileHash(name);
  if(!!hash){
      let certificate = new CertValidator('thisisfilename', hash);
      const accountId = Context.sender
      storage.set(accountId, certificate);
  }
  //return null;
}
*/


// Certificates smart-contract
import { Entity, Certificate, certificates, signedCertificates } from './models';


// The maximum number of latest messages the contract returns.
const CERTIFICATE_LIST_SIZE = 10;


// Gets all the certificates
export function getCertificates(): Certificate[] {
  const accountId = Context.sender
  const numCertifications = min(CERTIFICATE_LIST_SIZE, certificates.length);
  const startIndex = certificates.length - numCertifications;
  const result = new Array<Certificate>(numCertifications);
  for (let i = 0; i < numCertifications; i++) {
    result[i] = certificates[i + startIndex];
  }
  storage.get<string>(accountId, DEFAULT_MESSAGE);
  return result;
}

// Get signed certificates
export function getSignedCertificates(): Certificate[] {
  const numCertifications = min(CERTIFICATE_LIST_SIZE, signedCertificates.length);
  const startIndex = signedCertificates.length - numCertifications;
  const result = new Array<Certificate>(numCertifications);
  for (let i = 0; i < numCertifications; i++) {
    let signed = signedCertificates[i + startIndex].isSigned;
    if (signed) {
      result.push(signedCertificates[i + startIndex])
    }
  }
  return result;
}

// Add a certificate
export function addCertificate(name: string): void {
  const accountId = Context.sender
  var certificate = new Certificate(name);
  storage.set(accountId, certificate);
}

// Sign a certificate
export function signCertificate(certName: string, entity: Entity): void {
  const accountId = Context.sender;
  logging.log(`Certificating "${certName}" from "${entity.name}" for account "${accountId}"`)
  var certificates = getCertificates(); // Get the list of certificates
  var signedCertificate = new Certificate(''); // Create an empty certificate
  var found = false; // Flag to search if found in list (validation)
  for (let i = 0; i < certificates.length; i++) {
    var certificate = certificates[i];
    if (certificate.fileName == certName) {
      if (certificate.isSigned) return; 
      certificate.addCertificator(entity); // If certificate found and is not signed, sign it
      signedCertificate = certificate;
      found = true;
      break;
    }
  }
  if (found) storage.set(accountId, signedCertificate);
}
