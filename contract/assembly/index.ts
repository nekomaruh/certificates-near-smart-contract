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
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}

export function setGreeting(message: string): void {
  const accountId = Context.sender
  // Use logging.log to record logs permanently to the blockchain!
  logging.log(`Saving greeting "${message}" for account "${accountId}"`)
  storage.set(accountId, message)
}










// Certificates smart-contract

import { Entity, Certificate, entities, certificates, signedCertificates } from './models';

// The maximum number of latest messages the contract returns.
const CERTIFICATE_LIMIT = 10;


// Gets all the certificates
export function getCertificates(): Certificate[]{
  const numCertifications = min(CERTIFICATE_LIMIT, certificates.length);
  const startIndex = certificates.length - numCertifications;
  const result = new Array<Certificate>(numCertifications);
  for (let i = 0; i < numCertifications; i++) {
    result[i] = certificates[i + startIndex];
  }
  // Cambiar a storage
  return result;
}

// Get signed certificates
export function getSignedCertificates(): Certificate[] {
  const numCertifications = min(CERTIFICATE_LIMIT, signedCertificates.length);
  const startIndex = signedCertificates.length - numCertifications;
  const result = new Array<Certificate>(numCertifications);
  for (let i = 0; i < numCertifications; i++) {
    let signed = signedCertificates[i + startIndex].isSigned;
    if (signed) {
      result.push(signedCertificates[i + startIndex])
    }
  }
  // Cambiar a storage
  return result;
}

// Add a certificate
export function addCertificate(name: string):void {
  const accountId = Context.sender
  var certificate = new Certificate(name);
  storage.set(accountId, certificate);
}

// Sign a certificate
export function signCertificate(certName: string, entity: Entity): void {
  const accountId = Context.sender;
  logging.log(`Certificating "${certName}" from "${entity.name}" for account "${accountId}"`)
  var certificates = getCertificates();
  var signedCertificate = new Certificate('');
  for (let i = 0; i < certificates.length; i++) {
    var certificate = certificates[i];
    if (certificate.name == certName) {
      if (certificate.isSigned) return;
      certificate.addCertificator(entity);
      signedCertificate = certificate;
      break;
    }
  }
  storage.set(accountId, signedCertificate);
}
