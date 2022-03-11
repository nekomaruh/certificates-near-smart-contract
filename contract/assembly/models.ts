import { context, u128, PersistentVector, u256 } from "near-sdk-as";

@nearBindgen
export class Entity {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}

@nearBindgen
export class Certificate {
  private name: string;
  private signed: bool;
  private signedBy: Entity[];
  private maxEntities: number;

  constructor(
    name: string,
    signed: bool = false, 
    signedBy: Entity[] = [],
    ) {
    this.name = name;
    this.signed = signed;
    this.signedBy = signedBy;
    this.maxEntities = 4;
  }

  addCertificator(entity: Entity): void {
    if (this.signed) return;
    //this.signedBy.set(entity, true);
    this.signedBy.push(entity);
    if (this.signedBy.length <= this.maxEntities) {
      this.signed = true
      // GENERATE NFT
    }
  }

  public get isSigned(): bool {
    return this.signed;
  }

  public get fileName(): string{
    return this.name;
  }
}

export const certificates = new PersistentVector<Certificate>("c");
export const signedCertificates = new PersistentVector<Certificate>("s");
export const entities = new PersistentVector<Entity>("e");


/*
export class CertValidator{
  private name: string; // Name of the file (id)
  private hash: number; // URL where file is located
  constructor(
    name: string,
    hash: number
    ) {
    this.name = name;
    this.hash = hash;
  }
}
*/
